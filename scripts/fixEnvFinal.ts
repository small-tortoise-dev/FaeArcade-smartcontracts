import * as fs from 'fs'
import * as path from 'path'

async function main() {
  console.log('🔧 Fixing .env File for Blueprint Deployment')
  console.log('============================================')
  
  const envPath = path.join(process.cwd(), '.env')
  
  // Create clean .env content
  const cleanEnvContent = `# Network Configuration
NETWORK=testnet
TONCENTER_API_KEY=465dfb8f2e782d3ef695faa9df399ef6f4c3cbda3d246ee1dd79db738412873d

# Blueprint Wallet Configuration
WALLET_MNEMONIC=grace timber split drum shoulder soap monitor fresh pretty hamster core fiction gesture deal clutch obscure link pledge maze flat glance hat nasty fashion
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
  
  // Write clean .env file
  fs.writeFileSync(envPath, cleanEnvContent)
  
  console.log('✅ .env file fixed with proper Blueprint variables:')
  console.log('- WALLET_MNEMONIC: Set correctly')
  console.log('- WALLET_VERSION: v4R2')
  console.log('- TONCENTER_API_KEY: Configured')
  
  console.log('\n🚀 Now you can deploy:')
  console.log('npx blueprint run deployTreasury --testnet --mnemonic')
  
  console.log('\n💡 This will:')
  console.log('1. Create contract locally')
  console.log('2. Sign with your wallet')
  console.log('3. Broadcast via TON Center')
  console.log('4. Return contract address')
}

main().catch(console.error) 