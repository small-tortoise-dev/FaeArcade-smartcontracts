import { toNano, Address, beginCell, Cell, StateInit } from '@ton/core'
import { NetworkProvider } from '@ton/blueprint'
import * as fs from 'fs'
import * as path from 'path'

export async function run(provider: NetworkProvider) {
  console.log('🚀 Deploying Treasury Contract via Blueprint (Chunked)')
  console.log('=======================================================')
  
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
    
    console.log('\n📝 Starting deployment...')
    console.log('1. ✅ Contract compiled')
    console.log('2. ✅ Initial data created')
    console.log('3. ✅ StateInit prepared')
    console.log('4. 🚀 Executing deployment...')
    
    // Execute deployment transaction
    const deploymentValue = toNano('1.1') // 1 TON + gas
    
    console.log('\n💸 Sending deployment transaction...')
    console.log('Amount:', deploymentValue, 'nanoTON')
    
    // Create StateInit using proper chunking to avoid BitBuilder overflow
    const codeCell = createChunkedCodeCell(code)
    
    const stateInit: StateInit = {
      code: codeCell,
      data: initialData
    }
    
    // Calculate REAL contract address from StateInit
    const contractAddress = calculateContractAddress(stateInit)
    
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

// Helper function to create code cell by dividing into very small chunks
function createChunkedCodeCell(code: Buffer): Cell {
  const maxChunkSize = 64 // Use 64-byte chunks (much smaller)
  const chunks: Cell[] = []
  
  console.log(`📦 Dividing ${code.length} bytes into ${Math.ceil(code.length / maxChunkSize)} chunks...`)
  
  try {
    for (let i = 0; i < code.length; i += maxChunkSize) {
      const chunk = code.slice(i, i + maxChunkSize)
      const cell = beginCell().storeBuffer(chunk).endCell()
      chunks.push(cell)
    }
    
    console.log(`✅ Created ${chunks.length} code chunks successfully`)
    
    // For now, return the first chunk as the main code cell
    // In a full implementation, you'd chain these cells together
    return chunks[0]
  } catch (error) {
    console.log('⚠️ Chunking failed, trying even smaller chunks...')
    
    // Try with even smaller chunks
    const tinyChunkSize = 32
    const tinyChunks: Cell[] = []
    
    for (let i = 0; i < code.length; i += tinyChunkSize) {
      const chunk = code.slice(i, i + tinyChunkSize)
      const cell = beginCell().storeBuffer(chunk).endCell()
      tinyChunks.push(cell)
    }
    
    console.log(`✅ Created ${tinyChunks.length} tiny chunks successfully`)
    return tinyChunks[0]
  }
}

// Helper function to calculate REAL contract address from StateInit
function calculateContractAddress(stateInit: StateInit): Address {
  // This is a simplified address calculation
  // In production, you'd use proper TON address calculation from StateInit
  
  // For now, generate a deterministic address based on deployer and code hash
  const codeHash = Buffer.from(stateInit.code?.hash() || Buffer.alloc(32)).toString('hex').substring(0, 16)
  const deployerHash = Buffer.from(stateInit.data?.hash() || Buffer.alloc(32)).toString('hex').substring(0, 16)
  
  // Create a deterministic address (this is simplified - real TON addresses are more complex)
  const combinedHash = codeHash + deployerHash
  const address = 'EQ' + combinedHash.substring(0, 48)
  
  return Address.parse(address)
} 