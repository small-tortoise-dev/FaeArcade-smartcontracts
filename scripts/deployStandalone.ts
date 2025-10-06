import * as fs from 'fs'
import * as path from 'path'

async function main() {
  console.log('🚀 Deploying Treasury Contract to Testnet')
  console.log('==========================================')
  
  // Check if .env exists
  const envPath = path.join(process.cwd(), '.env')
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env file not found')
    console.log('Please create .env file with your configuration')
    return
  }
  
  // Check if build artifacts exist
  const buildPath = path.join(process.cwd(), 'build', 'Treasury')
  if (!fs.existsSync(buildPath)) {
    console.log('❌ Build artifacts not found')
    console.log('Run: npm run build first')
    return
  }
  
  console.log('✅ Build artifacts found')
  console.log('✅ Environment configured')
  
  // Read current .env
  const envContent = fs.readFileSync(envPath, 'utf8')
  
  // Check if contract is already deployed
  if (envContent.includes('TREASURY_ADDRESS=')) {
    const addressMatch = envContent.match(/TREASURY_ADDRESS=(.+)/)
    if (addressMatch) {
      const address = addressMatch[1].trim()
      console.log('\n📋 Contract already deployed:')
      console.log('Address:', address)
      console.log('\n🔗 View on explorer:')
      console.log(`https://testnet.tonscan.org/address/${address}`)
      
      console.log('\n💡 To redeploy:')
      console.log('1. Remove TREASURY_ADDRESS from .env')
      console.log('2. Run this script again')
      return
    }
  }
  
  console.log('\n📝 Deployment Instructions:')
  console.log('1. Use Blueprint CLI to deploy:')
  console.log('   npx blueprint run deploy --network testnet')
  console.log('\n2. Or use TON CLI:')
  console.log('   npx ton-cli deploy build/Treasury/Treasury.tact_Treasury.code.boc')
  console.log('\n3. After deployment, add TREASURY_ADDRESS to .env')
  
  console.log('\n🔧 Manual deployment steps:')
  console.log('1. Get testnet TON from @testgiver_ton_bot')
  console.log('2. Use Tonkeeper or TonHub wallet')
  console.log('3. Deploy the contract code')
  console.log('4. Update .env with the new address')
}

main().catch(console.error) 