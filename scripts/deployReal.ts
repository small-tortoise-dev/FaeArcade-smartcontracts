import * as fs from 'fs'
import * as path from 'path'

async function main() {
  console.log('🚀 Deploying Treasury Contract with Real Wallet')
  console.log('===============================================')
  
  const envPath = path.join(process.cwd(), '.env')
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env file not found')
    return
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8')
  
  // Check if mnemonic is set
  if (envContent.includes('your_real_mnemonic_phrase_here')) {
    console.log('❌ Please set your real mnemonic phrase in .env first')
    console.log('\n💡 To get your mnemonic phrase:')
    console.log('- Tonkeeper: Settings → Security → Backup → Show Recovery Phrase')
    console.log('- TonHub: Settings → Security → Backup → Show Recovery Phrase')
    console.log('- MyTonWallet: Settings → Security → Backup → Show Recovery Phrase')
    console.log('\nThen update MNEMONIC= in .env file and run this script again')
    return
  }
  
  // Check if contract is already deployed
  if (envContent.includes('TREASURY_ADDRESS=') && !envContent.includes('TREASURY_ADDRESS=\n') && !envContent.includes('TREASURY_ADDRESS=')) {
    const addressMatch = envContent.match(/TREASURY_ADDRESS=(.+)/)
    if (addressMatch && addressMatch[1].trim()) {
      const address = addressMatch[1].trim()
      console.log('✅ Contract already deployed:')
      console.log('Address:', address)
      console.log('\n🔗 View on explorer:')
      console.log(`https://testnet.tonscan.org/address/${address}`)
      return
    }
  }
  
  console.log('✅ Environment ready for deployment')
  console.log('✅ Build artifacts found')
  
  console.log('\n📝 Deployment Options:')
  console.log('\n1. **Blueprint CLI (Recommended):**')
  console.log('   npx blueprint run deploy --network testnet')
  console.log('\n2. **Manual Deployment:**')
  console.log('   - Use your wallet app to deploy contract')
  console.log('   - Contract code: build/Treasury/Treasury.tact_Treasury.code.boc')
  console.log('   - Initial data: build/Treasury/Treasury.tact_Treasury.data.boc')
  
  console.log('\n🔧 After deployment:')
  console.log('1. Copy the new contract address')
  console.log('2. Update TREASURY_ADDRESS= in .env file')
  console.log('3. Run: npm run test:contract')
  
  console.log('\n💡 Need help? Check:')
  console.log('- https://docs.ton.org/develop/smart-contracts/tutorials/deploy')
  console.log('- https://t.me/testgiver_ton_bot (for testnet TON)')
}

main().catch(console.error) 