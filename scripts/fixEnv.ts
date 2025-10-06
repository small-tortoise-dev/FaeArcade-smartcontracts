import * as fs from 'fs'
import * as path from 'path'

async function main() {
  console.log('🔧 Fixing Environment Variables for Blueprint')
  console.log('============================================')
  
  const envPath = path.join(process.cwd(), '.env')
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env file not found')
    return
  }
  
  // Read current .env
  let envContent = fs.readFileSync(envPath, 'utf8')
  
  // Extract mnemonic from current format
  const mnemonicMatch = envContent.match(/MNEMONIC="([^"]+)"/)
  if (!mnemonicMatch) {
    console.log('❌ MNEMONIC not found in .env')
    return
  }
  
  const mnemonic = mnemonicMatch[1]
  console.log('✅ Found mnemonic phrase')
  
  // Remove old MNEMONIC line
  envContent = envContent.replace(/MNEMONIC="[^"]+"/, '')
  
  // Add Blueprint-compatible environment variables
  const blueprintVars = `
# Blueprint Wallet Configuration
WALLET_MNEMONIC=${mnemonic}
WALLET_VERSION=v4R2
`
  
  // Insert after TONCENTER_API_KEY
  envContent = envContent.replace(
    /TONCENTER_API_KEY=([^\n]+)/,
    `TONCENTER_API_KEY=$1${blueprintVars}`
  )
  
  // Write updated .env
  fs.writeFileSync(envPath, envContent)
  
  console.log('✅ .env file updated with Blueprint variables:')
  console.log('- WALLET_MNEMONIC: Set')
  console.log('- WALLET_VERSION: v4R2')
  console.log('\n🚀 Now you can deploy:')
  console.log('npx blueprint run deployFixed --testnet --mnemonic')
}

main().catch(console.error) 