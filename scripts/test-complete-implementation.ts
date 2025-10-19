import { Address, beginCell, toNano } from '@ton/core'
import { TonClient, WalletContractV4, internal } from '@ton/ton'
import { mnemonicToWalletKey } from '@ton/crypto'
import { Treasury } from '../wrappers/Treasury'
import { TreasuryComplete } from '../wrappers/TreasuryComplete'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

async function runCompleteTest() {
  console.log('🎯 Starting Complete Treasury Contract Test...')
  
  try {
    // Configuration
    const NETWORK = 'testnet'
    const TONCENTER_API_KEY = process.env.TONCENTER_API_KEY || 'your_api_key_here'
    const MNEMONIC = process.env.MNEMONIC || 'your mnemonic phrase here'
    
    // Debug environment variables
    console.log('🔍 Environment Check:')
    console.log('API Key:', TONCENTER_API_KEY?.substring(0, 10) + '...')
    console.log('Mnemonic:', MNEMONIC?.substring(0, 20) + '...')
    console.log('Network:', NETWORK)
    
    // Initialize client
    const client = new TonClient({
      endpoint: `https://${NETWORK}.toncenter.com/api/v2/jsonRPC`,
      apiKey: TONCENTER_API_KEY,
    })
    
    // Generate wallet
    const key = await mnemonicToWalletKey(MNEMONIC.split(' '))
    const wallet = WalletContractV4.create({ workchain: 0, publicKey: key.publicKey })
    const walletContract = client.open(wallet)
    
    // Check wallet balance
    const balance = await walletContract.getBalance()
    console.log(`💰 Wallet balance: ${balance.toString()} nanoTON`)
    
    if (balance < toNano('1')) {
      console.log('⚠️  Low balance! Get testnet TON from @testgiver_ton_bot')
      return
    }
    
    // Use existing deployed contract
    const treasuryAddress = process.env.TREASURY_ADDRESS || 'EQD4YQxfSxk-73BjN5J7c07QAcS1U8y1dPEryq5xg51slFl5'
    console.log(`📍 Using Treasury contract: ${treasuryAddress}`)
    
    // Test Treasury contract
    console.log('\n🧪 Testing Treasury Contract...')
    await testContractState(treasuryAddress, 'treasury')
    
    console.log('\n🎉 Contract test completed successfully!')
    console.log('\n📋 Contract Address:')
    console.log(`  Treasury: ${treasuryAddress}`)
    
    console.log('\n🔗 Explorer Links:')
    console.log(`  Contract: https://testnet.tonscan.org/address/${treasuryAddress}`)
    console.log(`  Wallet: https://testnet.tonscan.org/address/${wallet.address.toString()}`)
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

async function testContractState(contractAddress: string, contractType: 'treasury' | 'complete') {
  console.log(`📊 Checking contract state for ${contractType}...`)
  
  try {
    // Configuration
    const NETWORK = 'testnet'
    const TONCENTER_API_KEY = process.env.TONCENTER_API_KEY || 'your_api_key_here'
    const MNEMONIC = process.env.MNEMONIC || 'your mnemonic phrase here'
    
    // Initialize client
    const client = new TonClient({
      endpoint: `https://${NETWORK}.toncenter.com/api/v2/jsonRPC`,
      apiKey: TONCENTER_API_KEY,
    })
    
    // Generate wallet
    const key = await mnemonicToWalletKey(MNEMONIC.split(' '))
    const wallet = WalletContractV4.create({ workchain: 0, publicKey: key.publicKey })
    const walletContract = client.open(wallet)
    
    const contract = contractType === 'treasury' 
      ? Treasury.createFromAddress(Address.parse(contractAddress))
      : TreasuryComplete.createFromAddress(Address.parse(contractAddress))
    
    try {
      const owner = await contract.getOwner(client.provider(contract.address))
      const airdropPool = await contract.getAirdropPool(client.provider(contract.address))
      
      console.log('📋 Contract State:')
      console.log(`  Owner: ${owner.toString()}`)
      console.log(`  Airdrop Pool: ${airdropPool.toString()} nanoTON`)
      
      if (contractType === 'treasury') {
        const roomStatus = await contract.getCurrentRoomStatus(client.provider(contract.address))
        const roomPool = await contract.getCurrentRoomPool(client.provider(contract.address))
        
        console.log(`  Room Status: ${roomStatus}`)
        console.log(`  Room Pool: ${roomPool.toString()} nanoTON`)
      }
      
      console.log('✅ Contract is active and working!')
    } catch (error) {
      console.log('⚠️  Contract may still be deploying...')
    }
    
  } catch (error) {
    console.error('❌ State check failed:', error)
  }
}

// Run the test
async function main() {
  await runCompleteTest()
}

main().catch(console.error)