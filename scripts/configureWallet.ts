import * as fs from 'fs'
import * as path from 'path'

async function main() {
  console.log('🔧 Wallet Configuration Helper')
  console.log('==============================')
  
  const envPath = path.join(process.cwd(), '.env')
  
  // Create .env file if it doesn't exist
  if (!fs.existsSync(envPath)) {
    console.log('📝 Creating .env file...')
    
    const defaultEnvContent = `# Network Configuration
NETWORK=testnet
TONCENTER_API_KEY=465dfb8f2e782d3ef695faa9df399ef6f4c3cbda3d246ee1dd79db738412873d

# Wallet Configuration - CHANGE THESE VALUES
MNEMONIC=your_real_mnemonic_phrase_here_12_words_separated_by_spaces
WALLET_VERSION=v4R2

# Treasury Contract Address (will be filled after deployment)
TREASURY_ADDRESS=

# Optional: Custom RPC endpoint
# TONCENTER_ENDPOINT=https://testnet.toncenter.com/api/v2/jsonRPC

# =============================================================================
# OPERATIONAL SETTINGS
# =============================================================================
# Default gas limit for transactions
DEFAULT_GAS_LIMIT=10000000

# Default transaction timeout (seconds)
TRANSACTION_TIMEOUT=60

# =============================================================================
# DEVELOPMENT SETTINGS
# =============================================================================
# Enable debug logging
DEBUG=false

# Test wallet balance (for development)
TEST_WALLET_BALANCE=10
`
    
    fs.writeFileSync(envPath, defaultEnvContent)
    console.log('✅ .env file created!')
  }
  
  console.log('\n📋 Current Configuration:')
  console.log('========================')
  
  const envContent = fs.readFileSync(envPath, 'utf8')
  const lines = envContent.split('\n')
  
  lines.forEach(line => {
    if (line.includes('MNEMONIC=') || line.includes('WALLET_VERSION=') || line.includes('TREASURY_ADDRESS=')) {
      if (line.includes('MNEMONIC=')) {
        const mnemonic = line.split('=')[1]
        if (mnemonic.includes('your_real_mnemonic_phrase_here')) {
          console.log('❌ MNEMONIC: Not configured (placeholder)')
        } else {
          console.log('✅ MNEMONIC: Configured')
        }
      } else if (line.includes('WALLET_VERSION=')) {
        console.log(`✅ WALLET_VERSION: ${line.split('=')[1]}`)
      } else if (line.includes('TREASURY_ADDRESS=')) {
        const address = line.split('=')[1]
        if (!address || address.trim() === '') {
          console.log('❌ TREASURY_ADDRESS: Not deployed yet')
        } else {
          console.log(`✅ TREASURY_ADDRESS: ${address}`)
        }
      }
    }
  })
  
  console.log('\n🔧 How to Configure:')
  console.log('===================')
  console.log('1. Edit FaeArcade-SmartContracts/.env file')
  console.log('2. Replace "your_real_mnemonic_phrase_here_12_words_separated_by_spaces" with your actual mnemonic')
  console.log('3. Owner/Upgrade Authority addresses are already configured:')
  console.log('   - Owner: 0QCUJFmHpbM8JHZRZMi-bjUW2oGY1lKjsisLjMwMNXBplNV6')
  console.log('   - Upgrade Authority: 0QAE68-izIsvSJ7eh7LnUcVIsV05oneViSZVAokybGLxLOMX')
  console.log('4. Run: npm run deploy:testnet')
  
  console.log('\n💡 Getting Your Mnemonic:')
  console.log('- Tonkeeper: Settings → Security → Backup → Show Recovery Phrase')
  console.log('- TonHub: Settings → Security → Backup → Show Recovery Phrase')
  console.log('- MyTonWallet: Settings → Security → Backup → Show Recovery Phrase')
  
  console.log('\n🚀 Next Steps:')
  console.log('1. Configure your mnemonic in .env')
  console.log('2. Get testnet TON from @testgiver_ton_bot')
  console.log('3. Run: npm run build')
  console.log('4. Run: npm run deploy:testnet')
}

main().catch(console.error)
