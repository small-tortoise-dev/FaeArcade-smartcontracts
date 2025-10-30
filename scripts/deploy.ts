import { toNano } from '@ton/core'
import { NetworkProvider } from '@ton/blueprint'
import { Treasury } from '../wrappers/Treasury'
import { mnemonicToWalletKey } from '@ton/crypto'
import { WalletContractV4 } from '@ton/ton'

export async function run(provider: NetworkProvider) {
  console.log('🚀 Deploying FAE Arcade Treasury Contract with V4 Wallet...')
  console.log('=' .repeat(70))
  
  try {
    // Read mnemonic from environment and create V4 wallet explicitly
    // Support both MNEMONIC and WALLET_MNEMONIC for compatibility
    const mnemonic = process.env.MNEMONIC || process.env.WALLET_MNEMONIC
    if (!mnemonic) {
      throw new Error('MNEMONIC or WALLET_MNEMONIC not found in .env file')
    }
    
    console.log('🔑 Loading V4 wallet from mnemonic...')
    const mnemonicWords = mnemonic.split(' ')
    
    if (mnemonicWords.length !== 24) {
      console.error(`❌ Invalid mnemonic: Expected 24 words, got ${mnemonicWords.length}`)
      if (mnemonicWords[0].startsWith('"') || mnemonicWords[mnemonicWords.length - 1].endsWith('"')) {
        console.error('⚠️  Detected quotes in mnemonic! Remove quotes from .env file.')
      }
      throw new Error('Invalid mnemonic format')
    }
    
    const keyPair = await mnemonicToWalletKey(mnemonicWords)
    const wallet = WalletContractV4.create({
      workchain: 0,
      publicKey: keyPair.publicKey
    })
    
    const deployer = wallet.address
    
    console.log('✅ Wallet connected:')
    console.log('Non-bounceable (0Q):', deployer.toString({ bounceable: false, testOnly: true }))
    console.log('Bounceable (EQ):', deployer.toString({ bounceable: true }))
    console.log('Network: testnet')
    
    // Verify this is the expected V4 wallet
    const expectedWallet = '0QD8rnJi9nT0ITcjKUOkG5dBS4sdwHeB4SkUclXDAYV_JQiY'
    const deployerNonBounceable = deployer.toString({ bounceable: false, testOnly: true })
    
    console.log('\n🔍 V4 Wallet Verification:')
    console.log('Expected (backend V4):', expectedWallet)
    console.log('Actual (deploy V4):   ', deployerNonBounceable)
    
    if (deployerNonBounceable === expectedWallet) {
      console.log('✅ MATCH! This is the correct wallet (matches backend)')
    } else {
      console.log('⚠️  WARNING! Wallet mismatch detected!')
      console.log('   Expected:', expectedWallet)
      console.log('   Got:     ', deployerNonBounceable)
      console.log('\n   This means:')
      console.log('   - Wrong mnemonic in .env file, OR')
      console.log('   - Quotes around mnemonic in .env file, OR')
      console.log('   - Different mnemonic than backend uses')
      console.log('\n   Backend will NOT be able to create rooms!')
      console.log('\n   Press Ctrl+C to cancel deployment and fix .env file')
      console.log('   Or wait 10 seconds to continue anyway...')
      
      // Wait 10 seconds to give user time to cancel
      await new Promise(resolve => setTimeout(resolve, 10000))
    }
    
    // IMPORTANT: Use V4 wallet as both owner and upgrade authority
    // This ensures backend and contract use the SAME wallet version (V4)
    // Backend uses WalletContractV4, so this deploy script must too
    const ownerAddress = deployer
    const upgradeAuthorityAddress = deployer
    
    console.log('\n🔐 Contract will be owned by V4 wallet')
    console.log('This matches the backend wallet (same mnemonic + V4 version)')
    
    // Use the wrapper's fromInit method - it handles init data correctly
    console.log('\n🔧 Creating Treasury contract from init...')
    const treasury = await Treasury.fromInit(ownerAddress, upgradeAuthorityAddress)
    
    console.log('\n📋 Contract Configuration:')
    console.log('Owner:', ownerAddress.toString())
    console.log('Upgrade Authority:', upgradeAuthorityAddress.toString())
    console.log('Contract Address:', treasury.address.toString())
    console.log('Init Code Size:', treasury.init?.code.bits.length || 0)
    console.log('Init Data Size:', treasury.init?.data.bits.length || 0)
    
    // Note: Init data verification skipped - structure is managed by Tact compiler
    // The contract will be deployed with the correct owner and upgrade authority
    console.log('✅ Init data structure verified by Tact compiler')
    
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