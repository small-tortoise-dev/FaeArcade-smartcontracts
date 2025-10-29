import { toNano, Address } from '@ton/core'
import { NetworkProvider } from '@ton/blueprint'
import { Treasury } from '../wrappers/Treasury'

export async function run(provider: NetworkProvider) {
  console.log('🚀 Deploying FAE Arcade Treasury Contract...')
  console.log('=' .repeat(50))
  
  try {
    // Get deployer address
    const deployerAddress = provider.sender().address
    if (!deployerAddress) {
      throw new Error('Wallet not connected')
    }
    const deployer = Address.parse(deployerAddress.toString())
    
    console.log('✅ Wallet connected:')
    console.log('Address:', deployer.toString())
    console.log('Network: testnet')
    
    // Configure specific addresses for owner and upgrade authority
    // Using deployer wallet as owner to get a different contract address
    const ownerAddress = deployer; // Use deployer wallet
    const upgradeAuthorityAddress = deployer; // Same as owner
    
    // Use the wrapper's fromInit method - it handles init data correctly
    console.log('\n🔧 Creating Treasury contract from init...')
    const treasury = await Treasury.fromInit(ownerAddress, upgradeAuthorityAddress)
    
    console.log('\n📋 Contract Configuration:')
    console.log('Owner:', ownerAddress.toString())
    console.log('Upgrade Authority:', upgradeAuthorityAddress.toString())
    console.log('Contract Address:', treasury.address.toString())
    console.log('Init Code Size:', treasury.init?.code.bits.length || 0)
    console.log('Init Data Size:', treasury.init?.data.bits.length || 0)
    
    // Verify init data
    if (treasury.init) {
      const dataSlice = treasury.init.data.beginParse()
      try {
        const testOwner = dataSlice.loadAddress()
        console.log('✅ Owner in init data:', testOwner.toString())
        const testAuth = dataSlice.loadAddress()
        console.log('✅ Authority in init data:', testAuth.toString())
      } catch (e) {
        console.error('❌ Failed to parse init data:', e)
      }
    }
    
    console.log('\n🚀 Deploying contract...')
    
    // Deploy with 0.5 TON
    await provider.deploy(treasury, toNano('0.5'))
    
    console.log('✅ Deployment transaction sent!')
    console.log('⏳ Waiting for confirmation...')
    
    // Wait for deployment
    await provider.waitForDeploy(treasury.address)
    
    console.log('\n🎉 Treasury Contract Deployed Successfully!')
    console.log('Contract Address:', treasury.address.toString())
    console.log('Owner:', ownerAddress.toString())
    console.log('Upgrade Authority:', upgradeAuthorityAddress.toString())
    
    console.log('\n📝 Add to your .env file:')
    console.log(`TREASURY_CONTRACT_ADDRESS=${treasury.address.toString()}`)
    
    console.log('\n🔗 View on explorer:')
    console.log(`https://testnet.tonscan.org/address/${treasury.address.toString()}`)
    
    // Update .env file
    console.log('\n💾 Updating .env file...')
    const fs = require('fs')
    const path = require('path')
    
    const envPath = path.join(process.cwd(), '.env')
    let envContent = ''
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8')
    }
    
    // Remove existing treasury address
    envContent = envContent.replace(/TREASURY_CONTRACT_ADDRESS=.*\n/g, '')
    
    // Add new treasury address
    envContent += `\n# Treasury Contract Address\n`
    envContent += `TREASURY_CONTRACT_ADDRESS=${treasury.address.toString()}\n`
    
    fs.writeFileSync(envPath, envContent)
    console.log('✅ .env file updated with contract address')
    
  } catch (error: any) {
    console.error('❌ Deployment failed:', error)
    console.log('\n🔧 Troubleshooting:')
    console.log('  1. Check your .env file has TONCENTER_API_KEY and MNEMONIC')
    console.log('  2. Make sure you have testnet TON in your wallet')
    console.log('  3. Get testnet TON from @testgiver_ton_bot on Telegram')
  }
}