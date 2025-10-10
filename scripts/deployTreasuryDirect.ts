import { toNano, Address } from '@ton/core'
import { NetworkProvider, compile } from '@ton/blueprint'

export async function run(provider: NetworkProvider) {
  console.log('🚀 Deploying Treasury Contract (Direct Method)')
  console.log('==============================================')
  
  try {
    // Get deployer address
    const deployerAddress = provider.sender().address
    if (!deployerAddress) {
      throw new Error('❌ Wallet not connected')
    }
    
    const deployer = Address.parse(deployerAddress.toString())
    console.log('✅ Wallet:', deployer.toString({bounceable: false, testOnly: true}))
    
    // Compile contract using Blueprint
    console.log('\n📦 Compiling Treasury contract...')
    const code = await compile('Treasury')
    console.log('✅ Contract compiled')
    
    // Import the generated contract for data creation
    const { Treasury } = await import('../contracts/Treasury.tact_Treasury')
    
    // Create Treasury instance
    console.log('\n📝 Creating Treasury instance...')
    const treasury = await Treasury.fromInit(deployer, deployer)
    
    console.log('✅ Contract address:', treasury.address.toString({bounceable: false, testOnly: true}))
    console.log('   Owner:', deployer.toString({bounceable: false, testOnly: true}))
    console.log('   Upgrade Authority:', deployer.toString({bounceable: false, testOnly: true}))
    
    // Check if already deployed
    const isDeployed = await provider.isContractDeployed(treasury.address)
    if (isDeployed) {
      console.log('\n⚠️  Contract already deployed!')
      console.log('Address:', treasury.address.toString({bounceable: false, testOnly: true}))
      return
    }
    
    // Open contract
    const openedTreasury = provider.open(treasury)
    
    // Deploy using the send method with Deploy message
    console.log('\n🚀 Deploying contract...')
    console.log('   Amount: 1.1 TON')
    
    await openedTreasury.send(
      provider.sender(),
      {
        value: toNano('1.1'),
      },
      {
        $$type: 'Deploy',
        queryId: 0n,
      }
    )
    
    console.log('⏳ Waiting for deployment...')
    await provider.waitForDeploy(treasury.address, 10)
    
    console.log('\n✅ Treasury deployed successfully!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📋 Contract Details:')
    console.log('   Address (user-friendly):', treasury.address.toString({bounceable: false, testOnly: true}))
    console.log('   Address (raw):', treasury.address.toString({bounceable: true, testOnly: true}))
    console.log('   Owner:', deployer.toString({bounceable: false, testOnly: true}))
    console.log('   Network: Testnet')
    console.log('\n🔗 View on Explorer:')
    console.log(`   https://testnet.tonscan.org/address/${treasury.address.toString({bounceable: false, testOnly: true})}`)
    console.log('\n📝 Add to your .env files:')
    console.log(`   TREASURY_CONTRACT_ADDRESS=${treasury.address.toString({bounceable: false, testOnly: true})}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
  } catch (error: any) {
    console.error('\n❌ Deployment failed:', error.message)
    if (error.stack) {
      console.error('Stack:', error.stack)
    }
    console.log('\n💡 Troubleshooting:')
    console.log('   1. Ensure you have ≥1.1 TON in your wallet')
    console.log('   2. Check your wallet connection')
    console.log('   3. Verify network is testnet')
    console.log('   4. Try refreshing your wallet connection')
    console.log('\n💰 Get testnet TON: @testgiver_ton_bot on Telegram')
    throw error
  }
}

