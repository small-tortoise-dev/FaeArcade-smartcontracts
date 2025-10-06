import * as fs from 'fs'
import * as path from 'path'

async function main() {
  console.log('🔧 Fixing Wallet Version Configuration')
  console.log('=====================================')
  
  try {
    const envPath = path.join(process.cwd(), '.env')
    
    if (!fs.existsSync(envPath)) {
      console.log('❌ .env file not found')
      return
    }
    
    // Read current .env content
    let envContent = fs.readFileSync(envPath, 'utf8')
    
    // Check if WALLET_VERSION already exists
    if (envContent.includes('WALLET_VERSION')) {
      console.log('✅ WALLET_VERSION already configured')
      return
    }
    
    // Add WALLET_VERSION after MNEMONIC
    if (envContent.includes('MNEMONIC=')) {
      // Replace MNEMONIC with WALLET_MNEMONIC and add WALLET_VERSION
      envContent = envContent.replace(
        'MNEMONIC=',
        'WALLET_MNEMONIC='
      )
      
      // Add WALLET_VERSION after WALLET_MNEMONIC
      const mnemonicIndex = envContent.indexOf('WALLET_MNEMONIC=')
      const endOfLine = envContent.indexOf('\n', mnemonicIndex)
      const insertPosition = endOfLine + 1
      
      const walletVersionLine = 'WALLET_VERSION=v4r2\n'
      envContent = envContent.slice(0, insertPosition) + walletVersionLine + envContent.slice(insertPosition)
      
      // Write updated .env
      fs.writeFileSync(envPath, envContent)
      
      console.log('✅ Wallet version configuration fixed!')
      console.log('Added: WALLET_VERSION=v4r2')
      console.log('Changed: MNEMONIC → WALLET_MNEMONIC')
    } else {
      console.log('❌ MNEMONIC not found in .env')
    }
    
  } catch (error) {
    console.log('❌ Error fixing wallet version:', error)
  }
}

main().catch(console.error) 