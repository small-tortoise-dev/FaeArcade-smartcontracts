import { mnemonicNew, mnemonicToPrivateKey } from '@ton/crypto'
import { WalletContractV4 } from '@ton/ton'
import { Address } from '@ton/core'

async function createWallet() {
  console.log('🔐 Generating new TON testnet wallet...\n')
  
  // Generate new mnemonic (24 words)
  const mnemonic = await mnemonicNew(24)
  
  // Derive keys from mnemonic
  const keyPair = await mnemonicToPrivateKey(mnemonic)
  
  // Create wallet contract
  const wallet = WalletContractV4.create({
    workchain: 0,
    publicKey: keyPair.publicKey
  })
  
  const address = wallet.address.toString({ testOnly: true })
  
  console.log('✅ Wallet Created Successfully!\n')
  console.log('=' .repeat(70))
  console.log('📍 TESTNET ADDRESS:')
  console.log(address)
  console.log('=' .repeat(70))
  console.log('\n🔑 MNEMONIC (SAVE THIS SECURELY!):')
  console.log(mnemonic.join(' '))
  console.log('=' .repeat(70))
  
  console.log('\n📝 SETUP INSTRUCTIONS:\n')
  console.log('1. Copy the mnemonic above')
  console.log('2. Create a .env file: copy env.example to .env')
  console.log('3. Replace the MNEMONIC value in .env with your new mnemonic')
  console.log('4. Get testnet TON tokens:\n')
  console.log('   Option A: Telegram bot - Send your address to @testgiver_ton_bot')
  console.log('   Option B: Web faucet - https://testnet.toncenter.com/\n')
  console.log('5. Check your balance at:')
  console.log(`   https://testnet.tonscan.org/address/${address}\n`)
  console.log('6. Wait 1-2 minutes for tokens to arrive')
  console.log('7. Deploy your contract: npm run deploy:testnet\n')
  
  console.log('⚠️  IMPORTANT: Never share your mnemonic! Save it securely!')
}

createWallet().catch(console.error)

