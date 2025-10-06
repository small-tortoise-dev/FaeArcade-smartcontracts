import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config()

async function main() {
  console.log('🚀 TON Contract Deployment via TON Center API')
  console.log('==============================================')
  
  // Check environment
  const apiKey = process.env.TONCENTER_API_KEY
  const mnemonic = process.env.WALLET_MNEMONIC
  
  if (!apiKey) {
    console.log('❌ TONCENTER_API_KEY not found in .env')
    return
  }
  
  if (!mnemonic) {
    console.log('❌ WALLET_MNEMONIC not found in .env')
    return
  }
  
  // Check contract files
  const contractDir = path.join(process.cwd(), 'contracts')
  const codePath = path.join(contractDir, 'Treasury.tact_Treasury.code.boc')
  
  if (!fs.existsSync(codePath)) {
    console.log('❌ Contract code file not found')
    console.log('Run: npm run build first')
    return
  }
  
  const code = fs.readFileSync(codePath)
  console.log('✅ Contract code loaded:', code.length, 'bytes')
  
  console.log('\n📋 Deployment Information:')
  console.log('Network: testnet')
  console.log('API Key: Configured')
  console.log('Wallet: Configured')
  
  console.log('\n🔧 Deployment Methods:')
  console.log('\n1. **TON Center API (Recommended):**')
  console.log('   - Use: https://toncenter.com/api/v2/')
  console.log('   - Endpoint: /sendBoc')
  console.log('   - Requires: API key, wallet credentials')
  
  console.log('\n2. **Manual via Wallet App:**')
  console.log('   - Use: Tonkeeper, TonHub, or MyTonWallet')
  console.log('   - Upload: Treasury.tact_Treasury.code.boc')
  console.log('   - Set initial balance: 1 TON')
  
  console.log('\n3. **TON CLI Tools:**')
  console.log('   - Install: npm install -g @ton/ton')
  console.log('   - Use: ton deploy command')
  
  console.log('\n4. **Third-party Services:**')
  console.log('   - TON Center: https://toncenter.com/')
  console.log('   - TON Tools: https://tools.ton.org/')
  
  console.log('\n📁 Contract Files:')
  console.log('Code:', codePath)
  console.log('Size:', code.length, 'bytes')
  
  console.log('\n💡 Next Steps:')
  console.log('1. Choose a deployment method above')
  console.log('2. Deploy the contract')
  console.log('3. Copy the new contract address')
  console.log('4. Update TREASURY_ADDRESS in .env')
  
  console.log('\n🔗 Resources:')
  console.log('- TON Center: https://toncenter.com/')
  console.log('- TON Docs: https://docs.ton.org/')
  console.log('- Testnet Faucet: @testgiver_ton_bot')
}

main().catch(console.error) 