import { toNano, Address } from '@ton/core'
import { NetworkProvider } from '@ton/blueprint'
import { Treasury } from '../contracts/Treasury.tact_Treasury'

export async function run(provider: NetworkProvider) {
  console.log('🚀 Deploying Treasury Contract')
  console.log('==============================')
  
  try {
    // Get deployer address
    const deployerAddress = provider.sender().address
    if (!deployerAddress) {
      throw new Error('❌ Wallet not connected')
    }
    
    const deployer = Address.parse(deployerAddress.toString())
    console.log('✅ Wallet:', deployer.toString({bounceable: false}))
    
    // Create Treasury instance
    console.log('\n📝 Creating Treasury contract...')
    const treasury = provider.open(
      await Treasury.fromInit(deployer, deployer)
    )
    
    console.log('✅ Contract address:', treasury.address.toString({bounceable: false}))
    console.log('   Owner:', deployer.toString({bounceable: false}))
    console.log('   Upgrade Authority:', deployer.toString({bounceable: false}))
    
    // Check if already deployed
    const isDeployed = await provider.isContractDeployed(treasury.address)
    if (isDeployed) {
      console.log('\n⚠️  Contract already deployed!')
      console.log('Address:', treasury.address.toString({bounceable: false}))
      return
    }
    
    // Deploy
    console.log('\n🚀 Deploying contract...')
    console.log('   Amount: 1.1 TON')
    
    await treasury.send(
      provider.sender(),
      { value: toNano('1.1') },
      { $$type: 'Deploy', queryId: 0n }
    )
    
    console.log('⏳ Waiting for deployment...')
    await provider.waitForDeploy(treasury.address)
    
    console.log('\n✅ Treasury deployed successfully!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📋 Contract Details:')
    console.log('   Address:', treasury.address.toString({bounceable: false}))
    console.log('   Owner:', deployer.toString({bounceable: false}))
    console.log('   Network: Testnet')
    console.log('\n🔗 View on Explorer:')
    console.log(`   https://testnet.tonscan.org/address/${treasury.address.toString({bounceable: false})}`)
    console.log('\n📝 Add to your .env files:')
    console.log(`   TREASURY_CONTRACT_ADDRESS=${treasury.address.toString({bounceable: false})}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
  } catch (error: any) {
    console.error('\n❌ Deployment failed:', error.message)
    console.log('\n💡 Troubleshooting:')
    console.log('   1. Ensure you have ≥1.1 TON in your wallet')
    console.log('   2. Check your wallet connection')
    console.log('   3. Verify network is testnet')
    console.log('\n💰 Get testnet TON: @testgiver_ton_bot on Telegram')
    throw error
  }
}

