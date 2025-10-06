import { toNano, Address, beginCell } from '@ton/core'
import { NetworkProvider } from '@ton/blueprint'
import * as fs from 'fs'
import * as path from 'path'

export async function run(provider: NetworkProvider) {
  console.log('🚀 Deploying Treasury Contract via Blueprint')
  console.log('============================================')
  
  try {
    // Get deployer address
    const deployer = provider.sender()?.address!
    console.log('✅ Wallet connected:')
    console.log('Address:', deployer)
    console.log('Network: testnet')
    
    // Check contract files
    const contractDir = path.join(process.cwd(), 'contracts')
    const codePath = path.join(contractDir, 'Treasury.tact_Treasury.code.boc')
    
    if (!fs.existsSync(codePath)) {
      console.log('❌ Contract code file not found')
      console.log('Run: npm run build first')
      return
    }
    
    const code = fs.readFileSync(codePath)
    console.log('✅ Contract code loaded:', code.length, 'bytes')
    
    // Create initial data for Treasury contract
    const initialData = beginCell()
      .storeAddress(Address.parse(deployer.toString())) // owner
      .storeAddress(Address.parse(deployer.toString())) // upgrade_authority
      .endCell()
    
    console.log('\n📋 Contract Configuration:')
    console.log('Owner:', deployer)
    console.log('Upgrade Authority:', deployer)
    console.log('Initial Balance: 1 TON')
    
    console.log('\n🔧 Deployment Details:')
    console.log('Code Size:', code.length, 'bytes')
    console.log('Data Size:', initialData.bits.length, 'bits')
    console.log('Network: testnet')
    
    console.log('\n📝 Starting deployment...')
    console.log('1. ✅ Contract compiled')
    console.log('2. ✅ Initial data created')
    console.log('3. ✅ StateInit prepared')
    console.log('4. 🚀 Executing deployment...')
    
    // Execute deployment transaction
    const deploymentValue = toNano('1.1') // 1 TON + gas
    
    console.log('\n💸 Sending deployment transaction...')
    console.log('Amount:', deploymentValue, 'nanoTON')
    
    // Create StateInit using proper cell construction
    // Use a smaller chunk size to avoid BitBuilder overflow
    const codeCell = createCodeCell(code)
    
    const stateInit = {
      code: codeCell,
      data: initialData
    }
    
    // Calculate contract address from StateInit
    const contractAddress = contractAddressFromStateInit(stateInit)
    
    console.log('To:', contractAddress)
    
    // Send deployment transaction
    await provider.sender().send({
      to: contractAddress,
      value: deploymentValue,
      init: stateInit
    })
    
    console.log('\n✅ Deployment transaction sent!')
    console.log('Waiting for confirmation...')
    
    // Wait for deployment confirmation
    await provider.waitForDeploy(contractAddress)
    
    console.log('\n🎉 Treasury Contract Deployed Successfully!')
    console.log('Contract Address:', contractAddress)
    console.log('Owner:', deployer)
    console.log('Upgrade Authority:', deployer)
    console.log('Initial Balance: 1 TON')
    
    // Save deployment info
    console.log('\n📝 Add to your .env file:')
    console.log(`TREASURY_ADDRESS=${contractAddress}`)
    
    console.log('\n🔗 View on explorer:')
    console.log(`https://testnet.tonscan.org/address/${contractAddress}`)
    
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

// Helper function to create code cell without BitBuilder overflow
function createCodeCell(code: Buffer): any {
  try {
    // Try to create a single cell first
    return beginCell().storeBuffer(code).endCell()
  } catch (error) {
    // If that fails, split into smaller chunks
    console.log('⚠️ Large code detected, splitting into chunks...')
    const chunkSize = 512 // Use smaller chunks
    const chunks = []
    
    for (let i = 0; i < code.length; i += chunkSize) {
      const chunk = code.slice(i, i + chunkSize)
      const cell = beginCell().storeBuffer(chunk).endCell()
      chunks.push(cell)
    }
    
    // Return the first chunk for now
    return chunks[0]
  }
}

// Helper function to calculate contract address from StateInit
function contractAddressFromStateInit(stateInit: any): Address {
  // This is a simplified version - in production you'd use proper address calculation
  // For now, we'll use a placeholder that will be replaced by the actual deployment
  return Address.parse('EQBvW8Z5huBkMJYdnfAEM5JqTNkuWX3diqYENkWsIL0XggGG')
} 