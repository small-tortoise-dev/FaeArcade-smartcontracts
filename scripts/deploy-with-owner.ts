import { toNano, Address } from '@ton/core'
import { Treasury } from '../wrappers/Treasury'
import { compile, NetworkProvider } from '@ton/blueprint'
import { mnemonicToWalletKey } from '@ton/crypto'
import { WalletContractV4 } from '@ton/ton'

export async function run(provider: NetworkProvider) {
  console.log('🚀 Deploying FAE Arcade Treasury Contract with Backend Wallet as Owner...')
  console.log('=' .repeat(70))
  
  try {
    // Get mnemonic from environment
    const mnemonic = process.env.WALLET_MNEMONIC
    if (!mnemonic) {
      throw new Error('WALLET_MNEMONIC environment variable not set')
    }

    // Get owner address from environment
    const ownerAddressStr = process.env.OWNER_ADDRESS
    if (!ownerAddressStr) {
      throw new Error('OWNER_ADDRESS environment variable not set')
    }

    const ownerAddress = Address.parse(ownerAddressStr)
    const upgradeAuthorityAddress = ownerAddress // Same as owner
    
    console.log('\n📋 Contract Configuration:')
    console.log('Owner:', ownerAddress.toString())
    console.log('Upgrade Authority:', upgradeAuthorityAddress.toString())
    
    // Use the wrapper's fromInit method
    console.log('\n🔧 Creating Treasury contract from init...')
    const treasury = await Treasury.fromInit(ownerAddress, upgradeAuthorityAddress)
    
    console.log('Contract Address:', treasury.address.toString())
    console.log('✅ Init data structure verified by Tact compiler')
    
    console.log('\n🚀 Deploying contract...')
    
    // Deploy with 0.5 TON
    await provider.deploy(treasury, toNano('0.5'))
    
    console.log('✅ Deployment transaction sent!')
    console.log('⏳ Waiting for confirmation...')
    
    // Wait for deployment
    await provider.waitForDeploy(treasury.address)
    
    console.log('\n🎉 Treasury Contract Deployed Successfully!')
    console.log('Contract Address:', treasury.address.toString())
    console.log('Owner:', ownerAddress.toString())
    console.log('Upgrade Authority:', upgradeAuthorityAddress.toString())
    
    console.log('\n📝 Update your backend .env file:')
    console.log(`TREASURY_CONTRACT_ADDRESS=${treasury.address.toString()}`)
    
    console.log('\n🔗 View on explorer:')
    console.log(`https://testnet.tonscan.org/address/${treasury.address.toString()}`)
    
  } catch (error: any) {
    console.error('❌ Deployment failed:', error)
    console.log('\n🔧 Troubleshooting:')
    console.log('  1. Make sure WALLET_MNEMONIC is set')
    console.log('  2. Make sure OWNER_ADDRESS is set')
    console.log('  3. Make sure you have testnet TON in your wallet')
    console.log('  4. Get testnet TON from @testgiver_ton_bot on Telegram')
  }
}

