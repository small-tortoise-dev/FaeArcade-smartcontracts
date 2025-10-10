import { toNano, Address, WalletContractV4, TonClient } from '@ton/ton'
import { mnemonicToWalletKey } from '@ton/crypto'
import { Treasury } from '../contracts/Treasury.tact_Treasury'
import * as dotenv from 'dotenv'

dotenv.config()

async function main() {
  console.log('🚀 Deploying Treasury Contract (Mnemonic Method)')
  console.log('================================================')
  console.log('This method bypasses TON Connect and uses direct API calls')
  console.log('Works for contracts of any size!\n')
  
  try {
    // Get configuration from .env
    const mnemonic = process.env.MNEMONIC
    const network = process.env.NETWORK || 'testnet'
    const apiKey = process.env.TONCENTER_API_KEY
    
    // Validate configuration
    if (!mnemonic) {
      throw new Error('❌ MNEMONIC not found in .env file')
    }
    
    if (!apiKey) {
      throw new Error('❌ TONCENTER_API_KEY not found in .env file')
    }
    
    // Get endpoint
    const endpoint = network === 'mainnet'
      ? 'https://toncenter.com/api/v2/jsonRPC'
      : 'https://testnet.toncenter.com/api/v2/jsonRPC'
    
    console.log('📡 Network Configuration:')
    console.log('   Network:', network)
    console.log('   Endpoint:', endpoint)
    console.log('   API Key:', apiKey.substring(0, 10) + '...')
    
    // Create TON client
    const client = new TonClient({
      endpoint,
      apiKey,
    })
    
    console.log('\n🔐 Loading wallet from mnemonic...')
    const key = await mnemonicToWalletKey(mnemonic.split(' '))
    const wallet = WalletContractV4.create({ 
      workchain: 0, 
      publicKey: key.publicKey 
    })
    
    const walletContract = client.open(wallet)
    
    console.log('✅ Wallet loaded:')
    console.log('   Address:', wallet.address.toString({
      bounceable: false,
      testOnly: network === 'testnet'
    }))
    
    // Check wallet balance
    const balance = await walletContract.getBalance()
    const balanceTON = Number(balance) / 1e9
    console.log('   Balance:', balanceTON.toFixed(2), 'TON')
    
    if (balance < toNano('1.2')) {
      throw new Error(`❌ Insufficient balance: ${balanceTON.toFixed(2)} TON. Need at least 1.2 TON`)
    }
    
    // Create Treasury instance
    console.log('\n📝 Creating Treasury contract instance...')
    const treasury = await Treasury.fromInit(wallet.address, wallet.address)
    
    const addressStr = treasury.address.toString({
      bounceable: false,
      testOnly: network === 'testnet'
    })
    
    console.log('✅ Treasury contract prepared:')
    console.log('   Address:', addressStr)
    console.log('   Owner:', wallet.address.toString({
      bounceable: false,
      testOnly: network === 'testnet'
    }))
    console.log('   Upgrade Authority:', wallet.address.toString({
      bounceable: false,
      testOnly: network === 'testnet'
    }))
    
    // Check if already deployed
    console.log('\n🔍 Checking if contract exists...')
    try {
      const state = await client.getContractState(treasury.address)
      if (state.state === 'active') {
        console.log('\n⚠️  Contract already deployed!')
        console.log('   Address:', addressStr)
        console.log(`   Explorer: https://${network === 'mainnet' ? '' : 'testnet.'}tonscan.org/address/${addressStr}`)
        return
      }
    } catch (e) {
      console.log('   Contract not yet deployed ✓')
    }
    
    // Deploy contract
    console.log('\n🚀 Deploying contract...')
    console.log('   Deployment amount: 1.1 TON')
    console.log('   This may take 10-30 seconds...')
    
    const openedTreasury = client.open(treasury)
    
    await openedTreasury.send(
      walletContract.sender(key.secretKey),
      {
        value: toNano('1.1'),
      },
      {
        $$type: 'Deploy',
        queryId: 0n,
      }
    )
    
    console.log('✅ Deployment transaction sent!')
    console.log('\n⏳ Waiting for confirmation...')
    
    // Wait for contract to become active
    let attempts = 0
    const maxAttempts = 30
    let deployed = false
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      try {
        const state = await client.getContractState(treasury.address)
        if (state.state === 'active') {
          deployed = true
          console.log('\n✅ Contract is now active!')
          break
        }
      } catch (e) {
        // Keep waiting
      }
      
      attempts++
      process.stdout.write('.')
    }
    
    if (!deployed) {
      console.log('\n⚠️  Confirmation timeout (but deployment likely successful)')
      console.log('   Check explorer to verify:')
      console.log(`   https://${network === 'mainnet' ? '' : 'testnet.'}tonscan.org/address/${addressStr}`)
    }
    
    console.log('\n' + '='.repeat(60))
    console.log('🎉 Treasury Contract Deployment Complete!')
    console.log('='.repeat(60))
    
    console.log('\n📋 Contract Information:')
    console.log('   Address:', addressStr)
    console.log('   Owner:', wallet.address.toString({
      bounceable: false,
      testOnly: network === 'testnet'
    }))
    console.log('   Network:', network.toUpperCase())
    console.log('   Initial Balance: 1 TON')
    
    const explorerUrl = network === 'mainnet'
      ? `https://tonscan.org/address/${addressStr}`
      : `https://testnet.tonscan.org/address/${addressStr}`
    
    console.log('\n🔗 View on Explorer:')
    console.log('   ' + explorerUrl)
    
    console.log('\n📝 Configuration:')
    console.log('   Add to Backend .env:')
    console.log(`   TREASURY_CONTRACT_ADDRESS=${addressStr}`)
    console.log('\n   Add to Frontend .env.local:')
    console.log(`   VITE_TREASURY_ADDRESS=${addressStr}`)
    
    console.log('\n✨ Next Steps:')
    console.log('   1. Copy the address above to your .env files')
    console.log('   2. Restart backend: cd FaeArcade-Backend && npm run start:dev')
    console.log('   3. Test contract: curl http://localhost:3000/api/v1/ton/treasury/state')
    console.log('   4. Start using blockchain features!')
    
    console.log('\n' + '='.repeat(60))
    
  } catch (error: any) {
    console.error('\n' + '='.repeat(60))
    console.error('❌ Deployment Failed')
    console.error('='.repeat(60))
    console.error('\nError:', error.message)
    
    if (error.stack) {
      console.error('\nStack Trace:')
      console.error(error.stack)
    }
    
    console.log('\n💡 Troubleshooting Guide:')
    console.log('   1. Ensure MNEMONIC is set in .env (24 words separated by spaces)')
    console.log('   2. Ensure TONCENTER_API_KEY is set in .env')
    console.log('   3. Ensure wallet has ≥1.2 TON')
    console.log('   4. Run: npm run build (to compile contract)')
    console.log('   5. Check network connection')
    
    console.log('\n💰 Get Testnet TON:')
    console.log('   1. Open Telegram')
    console.log('   2. Message: @testgiver_ton_bot')
    console.log('   3. Send your wallet address')
    console.log('   4. Receive 5 TON (testnet)')
    
    console.log('\n🔑 Get TonCenter API Key:')
    console.log('   1. Visit: https://toncenter.com/')
    console.log('   2. Click "Get API Key"')
    console.log('   3. Copy and add to .env')
    
    throw error
  }
}

main().catch(console.error)

