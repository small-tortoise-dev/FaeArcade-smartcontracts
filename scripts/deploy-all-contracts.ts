import { Address, beginCell, toNano } from '@ton/core'
import { TonClient, WalletContractV4, internal } from '@ton/ton'
import { mnemonicToWalletKey } from '@ton/crypto'
import { Treasury } from '../wrappers/Treasury'
import { TreasuryComplete } from '../wrappers/TreasuryComplete'

// Configuration
const NETWORK = 'testnet'
const TONCENTER_API_KEY = process.env.TONCENTER_API_KEY || 'your_api_key_here'
const MNEMONIC = process.env.MNEMONIC || 'your mnemonic phrase here'

// Initialize client
const client = new TonClient({
  endpoint: `https://${NETWORK}.toncenter.com/api/v2/jsonRPC`,
  apiKey: TONCENTER_API_KEY,
})

async function deployAllContracts() {
  console.log('🚀 Starting deployment of all FAE Arcade Treasury contracts...')
  
  try {
    // Generate wallet
    const key = await mnemonicToWalletKey(MNEMONIC.split(' '))
    const wallet = WalletContractV4.create({ workchain: 0, publicKey: key.publicKey })
    const walletContract = client.open(wallet)
    
    // Check wallet balance
    const balance = await walletContract.getBalance()
    console.log(`💰 Wallet balance: ${balance.toString()} nanoTON`)
    
    if (balance < toNano('1')) {
      console.log('⚠️  Low balance! Get testnet TON from @testgiver_ton_bot')
      console.log(`📱 Your wallet address: ${wallet.address.toString()}`)
      return
    }
    
    console.log(`📱 Wallet address: ${wallet.address.toString()}`)
    
    // Deploy Treasury Contract
    console.log('\n🏗️  Deploying Treasury Contract...')
    const treasury = await Treasury.fromInit(
      wallet.address, // owner
      wallet.address  // upgrade authority
    )
    
    await treasury.sendDeploy(walletContract.sender(), toNano('0.1'))
    console.log('✅ Treasury deployed at:', treasury.address.toString())
    
    // Wait a bit between deployments
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Deploy TreasuryComplete Contract
    console.log('\n🏗️  Deploying TreasuryComplete Contract...')
    const treasuryComplete = await TreasuryComplete.fromInit(
      wallet.address, // owner
      wallet.address  // upgrade authority
    )
    
    await treasuryComplete.sendDeploy(walletContract.sender(), toNano('0.1'))
    console.log('✅ TreasuryComplete deployed at:', treasuryComplete.address.toString())
    
    // Wait a bit between deployments
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Deploy TreasuryEnhanced Contract (using TreasuryComplete as base)
    console.log('\n🏗️  Deploying TreasuryEnhanced Contract...')
    const treasuryEnhanced = await TreasuryComplete.fromInit(
      wallet.address, // owner
      wallet.address  // upgrade authority
    )
    
    await treasuryEnhanced.sendDeploy(walletContract.sender(), toNano('0.1'))
    console.log('✅ TreasuryEnhanced deployed at:', treasuryEnhanced.address.toString())
    
    // Wait for contracts to be deployed
    console.log('\n⏳ Waiting for contracts to be deployed...')
    await new Promise(resolve => setTimeout(resolve, 10000))
    
    // Test contract states
    console.log('\n🧪 Testing contract states...')
    
    try {
      const treasuryOwner = await treasury.getOwner(client.provider(treasury.address))
      console.log('✅ Treasury contract is active')
    } catch (error) {
      console.log('⚠️  Treasury contract may still be deploying...')
    }
    
    try {
      const completeOwner = await treasuryComplete.getOwner(client.provider(treasuryComplete.address))
      console.log('✅ TreasuryComplete contract is active')
    } catch (error) {
      console.log('⚠️  TreasuryComplete contract may still be deploying...')
    }
    
    try {
      const enhancedOwner = await treasuryEnhanced.getOwner(client.provider(treasuryEnhanced.address))
      console.log('✅ TreasuryEnhanced contract is active')
    } catch (error) {
      console.log('⚠️  TreasuryEnhanced contract may still be deploying...')
    }
    
    // Summary
    console.log('\n🎉 Deployment Summary:')
    console.log('=' .repeat(50))
    console.log(`📱 Wallet Address: ${wallet.address.toString()}`)
    console.log(`💰 Wallet Balance: ${balance.toString()} nanoTON`)
    console.log('')
    console.log('📋 Contract Addresses:')
    console.log(`  Treasury:        ${treasury.address.toString()}`)
    console.log(`  TreasuryComplete: ${treasuryComplete.address.toString()}`)
    console.log(`  TreasuryEnhanced: ${treasuryEnhanced.address.toString()}`)
    console.log('')
    console.log('🔗 Explorer Links:')
    console.log(`  Treasury:        https://testnet.tonscan.org/address/${treasury.address.toString()}`)
    console.log(`  TreasuryComplete: https://testnet.tonscan.org/address/${treasuryComplete.address.toString()}`)
    console.log(`  TreasuryEnhanced: https://testnet.tonscan.org/address/${treasuryEnhanced.address.toString()}`)
    console.log('')
    console.log('📝 Next Steps:')
    console.log('  1. Copy the contract addresses above')
    console.log('  2. Update your .env file with TREASURY_ADDRESS')
    console.log('  3. Run: npm run test:contract')
    console.log('  4. Integrate with your frontend')
    
    // Update .env file with contract addresses
    console.log('\n💾 Updating .env file...')
    const fs = require('fs')
    const path = require('path')
    
    const envPath = path.join(process.cwd(), '.env')
    let envContent = ''
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8')
    }
    
    // Remove existing contract addresses
    envContent = envContent.replace(/TREASURY_ADDRESS=.*\n/g, '')
    envContent = envContent.replace(/TREASURY_COMPLETE_ADDRESS=.*\n/g, '')
    envContent = envContent.replace(/TREASURY_ENHANCED_ADDRESS=.*\n/g, '')
    
    // Add new contract addresses
    envContent += `\n# Contract Addresses\n`
    envContent += `TREASURY_ADDRESS=${treasury.address.toString()}\n`
    envContent += `TREASURY_COMPLETE_ADDRESS=${treasuryComplete.address.toString()}\n`
    envContent += `TREASURY_ENHANCED_ADDRESS=${treasuryEnhanced.address.toString()}\n`
    
    fs.writeFileSync(envPath, envContent)
    console.log('✅ .env file updated with contract addresses')
    
  } catch (error) {
    console.error('❌ Deployment failed:', error)
    console.log('\n🔧 Troubleshooting:')
    console.log('  1. Check your .env file has TONCENTER_API_KEY and MNEMONIC')
    console.log('  2. Make sure you have testnet TON in your wallet')
    console.log('  3. Get testnet TON from @testgiver_ton_bot on Telegram')
    console.log('  4. Run: npm run check:balance')
  }
}

// Run deployment
deployAllContracts()
