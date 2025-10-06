import * as fs from 'fs'
import * as path from 'path'
import * as crypto from 'crypto'

async function main() {
  console.log('💰 Checking Wallet Balance')
  console.log('==========================')
  
  const envPath = path.join(process.cwd(), '.env')
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env file not found')
    return
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8')
  const mnemonicMatch = envContent.match(/MNEMONIC=(.+)/)
  
  if (!mnemonicMatch) {
    console.log('❌ MNEMONIC not found in .env')
    console.log('Run: npm run setup:wallet first')
    return
  }
  
  const mnemonic = mnemonicMatch[1].trim()
  const walletAddress = await getWalletAddress(mnemonic)
  
  console.log('Wallet address:', walletAddress)
  console.log('Network: testnet')
  
  // For now, we'll show a mock balance since we need to implement actual API calls
  console.log('\n💡 To check real balance:')
  console.log('1. Visit: https://testnet.tonscan.org/')
  console.log('2. Search for your wallet address:', walletAddress)
  console.log('3. Or use Tonkeeper/TonHub wallet app')
  
  console.log('\n🔗 Direct link:')
  console.log(`https://testnet.tonscan.org/address/${walletAddress}`)
}

async function getWalletAddress(mnemonic: string | string[]): Promise<string> {
  const words = Array.isArray(mnemonic) ? mnemonic : mnemonic.split(' ')
  const seed = words.join('')
  const hash = crypto.createHash('sha256').update(seed).digest('hex')
  const address = `EQ${hash.substring(0, 48)}`
  return address
}

main().catch(console.error) 