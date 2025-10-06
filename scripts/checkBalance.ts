import { NetworkProvider } from '@ton/blueprint'
import { TonClient } from 'ton'
import * as dotenv from 'dotenv'

dotenv.config()

export async function run(provider: NetworkProvider) {
  console.log('💰 Checking Wallet Balance')
  console.log('==========================')
  
  const mnemonic = process.env.MNEMONIC
  if (!mnemonic) {
    console.log('❌ MNEMONIC not found in .env')
    console.log('Run: npm run setup:wallet first')
    return
  }
  
  try {
    // Get wallet address from mnemonic
    const walletAddress = await getWalletAddress(mnemonic)
    console.log('Wallet address:', walletAddress)
    
    // Check balance using TON Center API
    const client = new TonClient({
      endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC'
    })
    
    const balance = await client.getBalance(walletAddress)
    console.log('Balance:', balance, 'nanoTON')
    console.log('Balance:', Number(balance) / 1e9, 'TON')
    
    if (Number(balance) === 0) {
      console.log('\n💡 Get testnet TON from: https://t.me/testgiver_ton_bot')
    }
    
  } catch (error) {
    console.log('❌ Error checking balance:', error)
  }
}

async function getWalletAddress(mnemonic: string): Promise<string> {
  // Simple address generation for testing
  const words = mnemonic.split(' ')
  const seed = words.join('')
  const crypto = require('crypto')
  const hash = crypto.createHash('sha256').update(seed).digest('hex')
  
  // Generate a mock TON address (this is simplified for testing)
  const address = `EQ${hash.substring(0, 48)}`
  return address
} 