import { toNano, Address, beginCell } from '@ton/core'
import { NetworkProvider } from '@ton/blueprint'

export async function run(provider: NetworkProvider) {
  console.log('🚀 Deploying Treasury Contract via Blueprint')
  console.log('============================================')
  
  try {
    // Get deployer address and ensure it's properly formatted
    const deployerAddress = provider.sender().address
    if (!deployerAddress) {
      throw new Error('Wallet not connected')
    }
    const deployer = Address.parse(deployerAddress.toString())
    console.log('✅ Wallet connected:')
    console.log('Address:', deployer.toString())
    console.log('Network: testnet')
    
    // Import Treasury wrapper
    const { Treasury } = await import('../wrappers/Treasury')
    
    // Create Treasury contract instance using the wrapper
    const treasury = await Treasury.fromInit(deployer, deployer)
    
    console.log('\n📋 Contract Configuration:')
    console.log('Owner:', deployer.toString())
    console.log('Upgrade Authority:', deployer.toString())
    console.log('Initial Balance: 1 TON')
    
    console.log('\n🔧 Deployment Details:')
    console.log('Contract Address:', treasury.address.toString())
    console.log('Has init:', !!treasury.init)
    
    if (!treasury.init) {
      throw new Error('Treasury init is missing')
    }
    
    console.log('\n📝 Starting deployment...')
    console.log('1. ✅ Contract compiled')
    console.log('2. ✅ Initial data created')
    console.log('3. ✅ StateInit prepared')
    console.log('4. 🚀 Executing deployment...')
    
    // Execute deployment transaction
    const deploymentValue = toNano('1.1') // 1 TON + gas
    
    console.log('\n💸 Sending deployment transaction...')
    console.log('Amount:', deploymentValue, 'nanoTON')
    console.log('To:', treasury.address.toString())
    
    // Send deployment transaction directly using provider
    await provider.sender().send({
      to: treasury.address,
      value: deploymentValue,
      init: treasury.init,
      body: beginCell().endCell(), // Empty body for deployment
      bounce: false
    })
    
    console.log('\n✅ Deployment transaction sent!')
    console.log('Waiting for confirmation...')
    
    // Wait for deployment confirmation
    await provider.waitForDeploy(treasury.address)
    
    console.log('\n🎉 Treasury Contract Deployed Successfully!')
    console.log('Contract Address:', treasury.address.toString())
    console.log('Owner:', deployer.toString())
    console.log('Upgrade Authority:', deployer.toString())
    console.log('Initial Balance: 1 TON')
    
    // Save deployment info
    console.log('\n📝 Add to your .env file:')
    console.log(`TREASURY_ADDRESS=${treasury.address.toString()}`)
    
    console.log('\n🔗 View on explorer:')
    console.log(`https://testnet.tonscan.org/address/${treasury.address.toString()}`)
    
    console.log('\n🧪 Test your contract:')
    console.log('npm run test:contract')
    
  } catch (error: any) {
    console.log('❌ Deployment failed:', error)
    console.log('\n💡 Make sure you have:')
    console.log('1. Testnet TON in your wallet (at least 1.1 TON)')
    console.log('2. Correct mnemonic phrase in .env')
    console.log('3. Valid TONCENTER_API_KEY')
    
    if (error.message && error.message.includes('insufficient balance')) {
      console.log('\n💰 Get testnet TON from: @testgiver_ton_bot on Telegram')
    }
  }
} 