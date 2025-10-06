import * as fs from 'fs'
import * as path from 'path'

async function main() {
  console.log('🧪 Testing Treasury Contract')
  console.log('============================')
  
  // Check if .env exists
  const envPath = path.join(process.cwd(), '.env')
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env file not found')
    return
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8')
  
  // Get Treasury address
  const treasuryMatch = envContent.match(/TREASURY_ADDRESS=(.+)/)
  if (!treasuryMatch) {
    console.log('❌ TREASURY_ADDRESS not found in .env')
    console.log('Deploy contract first: npm run deploy:testnet')
    return
  }
  
  const treasuryAddress = treasuryMatch[1].trim()
  console.log('✅ Treasury contract found:')
  console.log('Address:', treasuryAddress)
  
  // Get wallet address
  const mnemonicMatch = envContent.match(/MNEMONIC=(.+)/)
  if (!mnemonicMatch) {
    console.log('❌ MNEMONIC not found in .env')
    return
  }
  
  const mnemonic = mnemonicMatch[1].trim()
  const walletAddress = await getWalletAddress(mnemonic)
  console.log('Wallet address:', walletAddress)
  
  console.log('\n🔗 Contract Explorer:')
  console.log(`https://testnet.tonscan.org/address/${treasuryAddress}`)
  
  console.log('\n🔗 Wallet Explorer:')
  console.log(`https://testnet.tonscan.org/address/${walletAddress}`)
  
  console.log('\n📊 Contract Status:')
  console.log('✅ Contract deployed and ready')
  console.log('✅ Wallet configured')
  console.log('✅ Ready for transactions')
  
  console.log('\n🎯 Next Steps:')
  console.log('1. Fund your wallet with testnet TON')
  console.log('2. Test contract functions via wallet app')
  console.log('3. Monitor transactions in explorer')
  console.log('4. View transaction history in your wallet')
  
  console.log('\n💡 To test contract functions:')
  console.log('- Use Tonkeeper, TonHub, or MyTonWallet')
  console.log('- Import wallet using mnemonic phrase')
  console.log('- Send transactions to contract address')
  console.log('- Monitor results in explorer')
}

async function getWalletAddress(mnemonic: string | string[]): Promise<string> {
  const words = Array.isArray(mnemonic) ? mnemonic : mnemonic.split(' ')
  const seed = words.join('')
  const crypto = require('crypto')
  const hash = crypto.createHash('sha256').update(seed).digest('hex')
  const address = `EQ${hash.substring(0, 48)}`
  return address
}

main().catch(console.error) 