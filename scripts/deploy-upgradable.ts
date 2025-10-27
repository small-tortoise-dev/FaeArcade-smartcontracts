import { toNano, Address } from '@ton/core'
import { NetworkProvider } from '@ton/blueprint'
import { Treasury } from '../wrappers/Treasury'

export async function run(provider: NetworkProvider, args: string[]) {
  console.log('🚀 Deploying Upgradable FAE Arcade Treasury Contract...')
  console.log('='.repeat(60))
  
  try {
    const deployerAddress = provider.sender().address
    if (!deployerAddress) {
      throw new Error('Wallet not connected')
    }
    const deployer = Address.parse(deployerAddress.toString())
    
    console.log('✅ Wallet connected:')
    console.log('Address:', deployer.toString())
    console.log('Network: testnet')
    
    const isUpgrade = args.includes('upgrade') || process.argv.includes('--upgrade')
    const isForce = args.includes('force') || process.argv.includes('--force')
    const existingContractAddress = process.env.TREASURY_CONTRACT_ADDRESS
    
    if (isUpgrade && existingContractAddress) {
      console.log('\n🔄 UPGRADE MODE')
      console.log('Existing contract:', existingContractAddress)
      
      const existingOwner = Address.parse(existingContractAddress)
      const newUpgradeAuthority = deployer
      
      const treasury = await Treasury.fromInit(existingOwner, newUpgradeAuthority)
      
      console.log('Creating new contract instance for upgrade...')
      await provider.deploy(treasury, toNano('1.1'))
      await provider.waitForDeploy(treasury.address)
      
      console.log('🎉 Upgrade Deployed Successfully!')
      console.log('New Contract Address:', treasury.address.toString())
      return
    }
    
    // INITIAL DEPLOYMENT OR EXISTING CHECK
    console.log('\n🆕 DEPLOYMENT MODE')
    
    // To get a NEW contract address, we need to use DIFFERENT init parameters
    // Contract address is deterministic: same (owner, upgrade_authority) = same address
    
    // Strategy: Use deployer as owner, Zero address as upgrade authority
    // This creates a NEW address different from existing deployment
    let ownerAddress = deployer
    let upgradeAuthorityAddress = Address.parse('EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c') // Zero address
    
    console.log('📝 Using deployer as owner with Zero address as upgrade authority')
    console.log('📝 This will create a NEW contract address')
    
    const treasury = await Treasury.fromInit(ownerAddress, upgradeAuthorityAddress)
    
    console.log('\n📋 Configuration:')
    console.log('Owner:', ownerAddress.toString())
    console.log('Upgrade Authority:', upgradeAuthorityAddress.toString())
    console.log('Contract Address:', treasury.address.toString())
    
    const isDeployed = await provider.isContractDeployed(treasury.address)
    
    if (isDeployed) {
      if (!isForce) {
        console.log('\n⚠️  Contract already exists at this address!')
        console.log('Contract Address:', treasury.address.toString())
        console.log('\n🔗 View contract on explorer:')
        console.log(`https://testnet.tonscan.org/address/${treasury.address.toString()}`)
        console.log('\n💡 This address is already deployed.')
        console.log('💡 Use --force flag to replace the code at this address')
        console.log('💡 Or use --upgrade flag to deploy to a different address')
        return
      }
      
      // Force flag: Cannot redeploy to existing address in TON
      console.log('\n⚠️  FORCE MODE - Contract already deployed at this address')
      console.log('📋 Contract Address:', treasury.address.toString())
      console.log('\n💡 This address is already deployed and cannot be updated.')
      console.log('💡 In TON, contract addresses are permanent.')
      console.log('\n💡 To deploy NEW code, you need a DIFFERENT address.')
      console.log('💡 Solution: Change the upgrade_authority to get a new address')
      console.log('\n🔄 Generating alternative configuration...')
      
      // Generate alternative: Use owner as upgrade authority too
      const alternativeTreasury = await Treasury.fromInit(deployer, deployer)
      const altIsDeployed = await provider.isContractDeployed(alternativeTreasury.address)
      
      if (!altIsDeployed) {
        console.log('\n✅ Found alternative address that is NOT deployed:')
        console.log('   Owner:', deployer.toString())
        console.log('   Upgrade Authority:', deployer.toString())
        console.log('   Address:', alternativeTreasury.address.toString())
        console.log('\n🚀 Deploying to alternative address...')
        
        await provider.deploy(alternativeTreasury, toNano('1.1'))
        await provider.waitForDeploy(alternativeTreasury.address)
        
        console.log('\n🎉 NEW Treasury Contract Deployed!')
        console.log('📋 NEW Contract Address:', alternativeTreasury.address.toString())
        console.log('\n📝 Update your backend .env file:')
        console.log(`TREASURY_CONTRACT_ADDRESS=${alternativeTreasury.address.toString()}`)
        console.log('\n🔗 View on explorer:')
        console.log(`https://testnet.tonscan.org/address/${alternativeTreasury.address.toString()}`)
        return
      } else {
        console.log('\n❌ Alternative address also exists!')
        console.log('💡 Both addresses are already deployed')
        console.log('💡 You need to use a completely different wallet to deploy')
        return
      }
    }
    
    // Deploy new contract
    console.log('\n🚀 Deploying contract...')
    await provider.deploy(treasury, toNano('1.1'))
    console.log('✅ Deployment transaction sent!')
    console.log('⏳ Waiting for confirmation...')
    
    await provider.waitForDeploy(treasury.address)
    
    console.log('\n🎉 Treasury Contract Deployed Successfully!')
    console.log('Contract Address:', treasury.address.toString())
    console.log('Owner:', ownerAddress.toString())
    console.log('Upgrade Authority:', upgradeAuthorityAddress.toString())
    console.log('\n📝 Add to your .env file:')
    console.log(`TREASURY_CONTRACT_ADDRESS=${treasury.address.toString()}`)
    
  } catch (error: any) {
    console.error('❌ Deployment failed:', error.message)
  }
}
