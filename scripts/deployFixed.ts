import { toNano, Address, beginCell } from '@ton/core'
import { NetworkProvider } from '@ton/blueprint'
import { Treasury } from '../wrappers/Treasury'

export async function run(provider: NetworkProvider) {
  console.log('🚀 Deploying FIXED Treasury Contract...')
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
    
    // Use deployer as both owner and upgrade authority
    const ownerAddress = deployer
    const upgradeAuthorityAddress = deployer
    
    // Create Treasury contract
    const treasury = await Treasury.fromInit(ownerAddress, upgradeAuthorityAddress)
    
    console.log('\n📋 Contract Configuration:')
    console.log('Owner:', ownerAddress.toString())
    console.log('Upgrade Authority:', upgradeAuthorityAddress.toString())
    console.log('Contract Address:', treasury.address.toString())
    
    console.log('\n🚀 Deploying FIXED contract...')
    
    // Deploy with 1.1 TON
    await provider.deploy(treasury, toNano('1.1'))
    
    console.log('✅ Deployment transaction sent!')
    console.log('⏳ Waiting for confirmation...')
    
    // Wait for deployment
    await provider.waitForDeploy(treasury.address)
    
    console.log('\n🎉 FIXED Treasury Contract Deployed Successfully!')
    console.log('Contract Address:', treasury.address.toString())
    console.log('Owner:', ownerAddress.toString())
    console.log('Upgrade Authority:', upgradeAuthorityAddress.toString())
    
    console.log('\n📝 Add to your .env file:')
    console.log(`TREASURY_ADDRESS=${treasury.address.toString()}`)
    
    console.log('\n🔗 View on explorer:')
    console.log(`https://testnet.tonscan.org/address/${treasury.address.toString()}`)
    
    console.log('\n✅ FIXES APPLIED:')
    console.log('- Added default message handler for simple TON transfers')
    console.log('- Contract now accepts 1.0 TON payments without message body')
    console.log('- Automatic room creation for default room (12345)')
    console.log('- Proper handling of excess amounts with refunds')
    
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
    envContent = envContent.replace(/TREASURY_ADDRESS=.*\n/g, '')
    
    // Add new treasury address
    envContent += `\n# Treasury Contract Address (FIXED VERSION)\n`
    envContent += `TREASURY_ADDRESS=${treasury.address.toString()}\n`
    
    fs.writeFileSync(envPath, envContent)
    console.log('✅ .env file updated with FIXED contract address')
    
  } catch (error: any) {
    console.error('❌ Deployment failed:', error)
    console.log('\n🔧 Troubleshooting:')
    console.log('  1. Check your .env file has TONCENTER_API_KEY and MNEMONIC')
    console.log('  2. Make sure you have testnet TON in your wallet')
    console.log('  3. Get testnet TON from @testgiver_ton_bot on Telegram')
  }
}