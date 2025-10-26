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
    const existingContractAddress = process.env.TREASURY_CONTRACT_ADDRESS
    
    if (isUpgrade && existingContractAddress) {
      console.log('\n🔄 UPGRADE MODE')
      console.log('Existing contract:', existingContractAddress)
      
      const existingOwner = Address.parse("0QDOoeBGMtBp576nfJoEDAb6fVzBai0FxDBMTl6cv2tBvtzk")
      const newUpgradeAuthority = deployer
      
      console.log('Creating new contract instance for upgrade...')
      const treasury = await Treasury.fromInit(existingOwner, newUpgradeAuthority)
      
      console.log('\n📋 Upgrade Configuration:')
      console.log('Owner (unchanged):', existingOwner.toString())
      console.log('New Upgrade Authority:', newUpgradeAuthority.toString())
      console.log('New Contract Address:', treasury.address.toString())
      
      console.log('\n🚀 Deploying upgraded contract...')
      await provider.deploy(treasury, toNano('1.1'))
      console.log('✅ Upgrade deployment transaction sent!')
      await provider.waitForDeploy(treasury.address)
      
      console.log('\n🎉 Treasury Contract Upgrade Deployed Successfully!')
      console.log('New Contract Address:', treasury.address.toString())
      console.log('\n📝 Update your .env file:')
      console.log(`TREASURY_CONTRACT_ADDRESS=${treasury.address.toString()}`)
      return
    }
    
    // INITIAL DEPLOYMENT
    console.log('\n🆕 INITIAL DEPLOYMENT MODE')
    
    const ownerAddress = deployer
    const upgradeAuthorityAddress = deployer // Use deployer for both to get unique address
    
    const treasury = await Treasury.fromInit(ownerAddress, upgradeAuthorityAddress)
    
    console.log('\n📋 Configuration:')
    console.log('Owner:', ownerAddress.toString())
    console.log('Upgrade Authority:', upgradeAuthorityAddress.toString())
    console.log('Contract Address:', treasury.address.toString())
    
    const isDeployed = await provider.isContractDeployed(treasury.address)
    
    if (isDeployed) {
      console.log('\n✅ Contract already exists at this address!')
      console.log('Contract Address:', treasury.address.toString())
      console.log('\n🔗 View contract on explorer:')
      console.log(`https://testnet.tonscan.org/address/${treasury.address.toString()}`)
      return
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
    console.log('\n🔗 View on explorer:')
    console.log(`https://testnet.tonscan.org/address/${treasury.address.toString()}`)
    
  } catch (error: any) {
    console.error('❌ Deployment failed:', error.message)
  }
}

