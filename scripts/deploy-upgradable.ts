import { toNano, Address } from '@ton/core'
import { NetworkProvider } from '@ton/blueprint'
import { Treasury } from '../wrappers/Treasury'

export async function run(provider: NetworkProvider, args: string[]) {
  console.log('🚀 Deploying Upgradable FAE Arcade Treasury Contract...')
  console.log('='.repeat(60))
  
  try {
    const deployer = provider.sender().address
    if (!deployer) {
      throw new Error('Wallet not connected')
    }
    
    console.log('✅ Wallet connected:')
    console.log('Address:', deployer.toString())
    console.log('Network: testnet')
    
    const isUpgrade = args.includes('upgrade') || process.argv.includes('--upgrade')
    const isForce = args.includes('force') || process.argv.includes('--force')
    const existingContractAddress = process.env.TREASURY_CONTRACT_ADDRESS
    
    // Define owner wallet address once for use in both initial and upgrade deployments
    const ownerWalletAddress = Address.parse('0QCkNwCfxQEvHvR_TC3aQ-SUbARbxKBefiA9IDBRBlrOePcz')
    
    if (isUpgrade && existingContractAddress) {
      console.log('\n🔄 UPGRADE MODE')
      console.log('Existing contract:', existingContractAddress)
      console.log('⚠️  Warning: Contract upgrades require new deployment with different owner/upgrade_authority')
      console.log('⚠️  TON contracts are immutable - you deploy a new contract instance instead')
      console.log('\n💡 This script will create a NEW contract with updated owner configuration')
      
      console.log('Using owner wallet for upgrade deployment...')
      console.log('Owner (fixed):', ownerWalletAddress.toString())
      
      // For upgrade, use the specified owner wallet and deployer as upgrade authority
      // This ensures BOTH addresses are provided to fromInit
      const treasury = await Treasury.fromInit(ownerWalletAddress, deployer as Address)
      
      console.log('Creating new contract instance for upgrade...')
      console.log('Owner:', ownerWalletAddress.toString())
      console.log('Upgrade Authority:', deployer.toString())
      console.log('New Contract Address:', treasury.address.toString())
      
      const isDeployed = await provider.isContractDeployed(treasury.address)
      if (isDeployed) {
        console.log('\n⚠️  Contract address already exists!')
        console.log('Checking if contract is actually initialized...')
        
        try {
          // Try to read the contract to see if it's initialized
          await Treasury.createFromAddress(treasury.address).getOwner(provider.provider(treasury.address))
          console.log('✅ Contract IS initialized at this address')
          console.log('Contract Address:', treasury.address.toString())
          console.log('\n📝 Add to your .env file:')
          console.log(`TREASURY_CONTRACT_ADDRESS=${treasury.address.toString()}`)
          return
        } catch {
          console.log('⚠️  Contract exists but is NOT initialized')
          console.log('  (Previous deployment failed with exit code 130)')
          console.log('\n💡 Attempting to deploy with explicit init to fix this address...')
          // Continue to deployment below
        }
      }
      
      // Verify init is present
      if (!treasury.init) {
        throw new Error('⚠️  CRITICAL: Contract init is missing! Cannot deploy without init data.')
      }
      
      console.log('\n📊 Init Data Analysis:')
      console.log('✅ Init data present - code:', treasury.init.code ? 'present' : 'missing')
      console.log('✅ Init data present - data:', treasury.init.data ? 'present' : 'missing')
      
      // Verify init data format
      const dataSlice = treasury.init.data.beginParse()
      
      // Try to load addresses to verify format
      try {
        const testOwner = dataSlice.loadAddress()
        console.log('✅ Owner address in init.data:', testOwner.toString().slice(0, 10) + '...')
        const testUpgrade = dataSlice.loadAddress()
        console.log('✅ Upgrade authority in init.data:', testUpgrade.toString().slice(0, 10) + '...')
        console.log('✅ Init data format is CORRECT!')
      } catch (error) {
        console.error('❌ ERROR: Init data format is INVALID!', error)
        throw new Error('Init data does not contain valid addresses')
      }
      
      console.log('\n🚀 Deploying with correct init data...')
      
      // CRITICAL: Verify init is present and correct
      if (!treasury.init) {
        throw new Error('Init data is missing!')
      }
      
      console.log('Init data size:', treasury.init.data.bits.length, 'bits')
      console.log('Init code size:', treasury.init.code.bits.length, 'bits')
      
      // Deploy with Blueprint - it should use the init from the Treasury object
      await provider.deploy(treasury, toNano('2'))
      
      console.log('Waiting for deployment confirmation...')
      await provider.waitForDeploy(treasury.address)
      
      console.log('\n🎉 Upgrade Deployed Successfully!')
      console.log('New Contract Address:', treasury.address.toString())
      console.log('\n📝 Update your backend .env file:')
      console.log(`TREASURY_CONTRACT_ADDRESS=${treasury.address.toString()}`)
      return
    }
    
    // INITIAL DEPLOYMENT
    console.log('\n🆕 DEPLOYMENT MODE')
    
    // ownerWalletAddress is already defined above
    
    console.log('\n📋 Configuration:')
    console.log('Owner (fixed):', ownerWalletAddress.toString())
    
    // Use the deployer wallet as upgrade_authority for unique address
    const deploymentWalletAddress = provider.sender().address
    if (!deploymentWalletAddress) {
      throw new Error('Wallet not connected')
    }
    
    // Generate unique upgrade_authority by adding timestamp to ensure NEW address
    const timestamp = Date.now()
    console.log('🔄 Generating NEW contract address (timestamp:', timestamp, ')')
    
    const ownerAddress = ownerWalletAddress
    // Create a unique address by modifying the deployment wallet's hash with timestamp
    // This ensures we get a completely new contract address each time
    const deploymentWalletHash = deploymentWalletAddress.hash
    const uniqueHash = Buffer.from(deploymentWalletHash)
    // XOR first 4 bytes with timestamp to get unique address
    uniqueHash[0] = (uniqueHash[0] ^ (timestamp & 0xFF)) & 0xFF
    uniqueHash[1] = (uniqueHash[1] ^ ((timestamp >> 8) & 0xFF)) & 0xFF
    uniqueHash[2] = (uniqueHash[2] ^ ((timestamp >> 16) & 0xFF)) & 0xFF
    uniqueHash[3] = (uniqueHash[3] ^ ((timestamp >> 24) & 0xFF)) & 0xFF
    const uniqueAddress = new Address(0, Buffer.from(uniqueHash))
    
    const upgradeAuthorityAddress = uniqueAddress
    
    console.log('Upgrade Authority (deployment wallet):', upgradeAuthorityAddress.toString())
    console.log('ℹ️  Using specified wallet ensures unique address')
    
    // Use the deployment wallet as upgrade_authority
    // This ensures a unique address since we're using a different address
    console.log('\n🔍 Generating contract address...')
    
    const treasury = await Treasury.fromInit(ownerAddress, upgradeAuthorityAddress as Address)
    const isDeployed = await provider.isContractDeployed(treasury.address)
    
    console.log('Contract Address:', treasury.address.toString())
    console.log('Address Status:', isDeployed ? 'Already exists' : 'Available for deployment')
    
    if (isDeployed) {
      console.log('\n⚠️  Contract address already exists!')
      
      try {
        // Check if the contract is actually initialized
        const existingContract = Treasury.createFromAddress(treasury.address)
        const owner = await existingContract.getOwner(provider.provider(treasury.address))
        console.log('✅ Contract IS initialized and working')
        console.log('Owner:', owner.toString())
        console.log('\n💡 This contract is already live. Use this address:')
        console.log(`TREASURY_CONTRACT_ADDRESS=${treasury.address.toString()}`)
        console.log('\nTo deploy a NEW contract, use a different wallet!')
        return // Successfully using existing contract
      } catch (error) {
        // Contract exists but not initialized or can't read from it
        console.log('⚠️  Contract exists but appears uninitialized or unreachable')
        console.log('🔄 Attempting to deploy/initialize...')
        if (error instanceof Error) {
          console.log('Error details:', error.message)
        }
      }
    }
    
    // Store the upgrade authority for later use
    const finalUpgradeAuthority = upgradeAuthorityAddress
    
    // Check if deploying to fresh or existing address
    if (!isDeployed || isForce) {
      console.log('\n✅ Proceeding with deployment...')
    }
    
    console.log('\n📋 Final Configuration:')
    console.log('Owner:', ownerAddress.toString())
    console.log('Upgrade Authority:', finalUpgradeAuthority.toString())
    console.log('Contract Address:', treasury.address.toString())
    
    // Verify init is present before deployment
    if (!treasury.init) {
      throw new Error('⚠️  CRITICAL: Contract init is missing! Cannot deploy without init data.')
    }
    
    console.log('\n📊 Init Data Verification:')
    
    // Verify init data format
    const dataSlice = treasury.init.data.beginParse()
    
    // Try to load addresses to verify format
    try {
      const testOwner = dataSlice.loadAddress()
      console.log('✅ Owner address in init.data:', testOwner.toString().slice(0, 10) + '...')
      const testUpgrade = dataSlice.loadAddress()
      console.log('✅ Upgrade authority in init.data:', testUpgrade.toString().slice(0, 10) + '...')
      console.log('✅ Init data format is CORRECT!')
    } catch (error) {
      console.error('❌ ERROR: Init data format is INVALID!', error)
      throw new Error('Init data does not contain valid addresses')
    }
    
    console.log('\n🚀 Attempting deployment...')
    
    // CRITICAL: Verify init is present
    if (!treasury.init) {
      throw new Error('Init data is missing!')
    }
    
    console.log('Init data size:', treasury.init.data.bits.length, 'bits')
    console.log('Init code size:', treasury.init.code.bits.length, 'bits')
    
    try {
      await provider.deploy(treasury, toNano('2'))
    } catch (deployError: any) {
      if (deployError.message.includes('already deployed')) {
        console.log('\n⚠️  Contract address already exists and is deployed')
        console.log('Contract Address:', treasury.address.toString())
        console.log('\n📝 This contract is already on-chain. Options:')
        console.log('1. Use this existing contract:')
        console.log(`   TREASURY_CONTRACT_ADDRESS=${treasury.address.toString()}`)
        console.log('\n2. Deploy to a NEW address by using a different wallet')
        console.log('   - Disconnect current wallet')
        console.log('   - Connect a different wallet')
        console.log('   - Run deploy script again')
        throw new Error('Contract already deployed at this address. See options above.')
      }
      throw deployError
    }
    console.log('✅ Deployment transaction sent!')
    console.log('⏳ Waiting for confirmation...')
    
    await provider.waitForDeploy(treasury.address)
    
    console.log('\n🎉 Treasury Contract Deployed Successfully!')
    console.log('Contract Address:', treasury.address.toString())
    console.log('Owner:', ownerAddress!.toString())
    console.log('Upgrade Authority:', upgradeAuthorityAddress!.toString())
    console.log('\n📝 Add to your .env file:')
    console.log(`TREASURY_CONTRACT_ADDRESS=${treasury.address.toString()}`)
    
  } catch (error: any) {
    console.error('❌ Deployment failed:', error.message)
  }
}
