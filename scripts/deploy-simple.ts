import { Address, beginCell, toNano } from '@ton/core'
import { TonClient, WalletContractV4, internal } from '@ton/ton'
import { mnemonicToWalletKey } from '@ton/crypto'
import { Treasury } from '../wrappers/Treasury'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Configuration
const NETWORK = 'testnet'
const TONCENTER_API_KEY = process.env.TONCENTER_API_KEY || 'your_api_key_here'
const MNEMONIC = process.env.MNEMONIC || 'your mnemonic phrase here'

async function deployTreasury() {
  console.log('🚀 Deploying FAE Arcade Treasury Contract...')
  console.log('=' .repeat(50))
  
  // Debug environment variables
  console.log('🔍 Environment Check:')
  console.log('API Key:', TONCENTER_API_KEY.substring(0, 10) + '...')
  console.log('Mnemonic:', MNEMONIC.substring(0, 20) + '...')
  console.log('Network:', NETWORK)
  
  try {
    // Initialize client
    const client = new TonClient({
      endpoint: `https://${NETWORK}.toncenter.com/api/v2/jsonRPC`,
      apiKey: TONCENTER_API_KEY,
    })
    
    // Generate wallet
    const key = await mnemonicToWalletKey(MNEMONIC.split(' '))
    const wallet = WalletContractV4.create({ workchain: 0, publicKey: key.publicKey })
    const walletContract = client.open(wallet)
    
    // Check wallet balance
    const balance = await walletContract.getBalance()
    console.log(`💰 Wallet balance: ${balance.toString()} nanoTON`)
    
    if (balance < toNano('1.1')) {
      console.log('⚠️  Low balance! Get testnet TON from @testgiver_ton_bot')
      console.log(`📱 Your wallet address: ${wallet.address.toString()}`)
      return
    }
    
    console.log(`📱 Wallet address: ${wallet.address.toString()}`)
    
    // Create Treasury contract
    console.log('\n🏗️  Creating Treasury contract...')
    const treasury = await Treasury.fromInit(
      wallet.address, // owner
      wallet.address  // upgrade authority
    )
    
    console.log('✅ Contract created')
    console.log(`📍 Contract address: ${treasury.address.toString()}`)
    
    // Deploy contract
    console.log('\n🚀 Deploying contract...')
    
    // Send deployment transaction using internal method
    await walletContract.send(internal({
      to: treasury.address,
      value: toNano('1.1'),
      init: treasury.init,
      body: beginCell().endCell(),
      bounce: false
    }))
    
    console.log('✅ Deployment transaction sent!')
    console.log('⏳ Waiting for confirmation...')
    
    // Wait for deployment
    await new Promise(resolve => setTimeout(resolve, 10000))
    
    // Test contract state
    console.log('\n🧪 Testing contract state...')
    try {
      const owner = await treasury.getOwner(client.provider(treasury.address))
      console.log('✅ Contract is active and deployed!')
      console.log(`👤 Owner: ${owner.toString()}`)
    } catch (error) {
      console.log('⚠️  Contract may still be deploying...')
    }
    
    // Summary
    console.log('\n🎉 Deployment Summary:')
    console.log('=' .repeat(50))
    console.log(`📱 Wallet Address: ${wallet.address.toString()}`)
    console.log(`💰 Wallet Balance: ${balance.toString()} nanoTON`)
    console.log(`📍 Contract Address: ${treasury.address.toString()}`)
    console.log('')
    console.log('🔗 Explorer Links:')
    console.log(`  Contract: https://testnet.tonscan.org/address/${treasury.address.toString()}`)
    console.log(`  Wallet: https://testnet.tonscan.org/address/${wallet.address.toString()}`)
    console.log('')
    console.log('📝 Add to your .env file:')
    console.log(`TREASURY_ADDRESS=${treasury.address.toString()}`)
    console.log('')
    console.log('🧪 Test your contract:')
    console.log('npm run test:contract')
    
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
    envContent += `\n# Treasury Contract Address\n`
    envContent += `TREASURY_ADDRESS=${treasury.address.toString()}\n`
    
    fs.writeFileSync(envPath, envContent)
    console.log('✅ .env file updated with contract address')
    
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
deployTreasury()
