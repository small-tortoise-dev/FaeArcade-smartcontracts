import { toNano, Address } from '@ton/core'
import { TonClient } from '@ton/ton'
import { Treasury } from '../wrappers/Treasury'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

async function checkContractStatus() {
  console.log('🔍 Checking Treasury Contract Status...')
  console.log('=' .repeat(50))
  
  try {
    // Get environment variables
    const apiKey = process.env.TONCENTER_API_KEY
    const network = process.env.NETWORK || 'testnet'
    const contractAddress = process.env.TREASURY_CONTRACT_ADDRESS
    
    if (!apiKey) {
      throw new Error('TONCENTER_API_KEY not found in environment')
    }
    
    if (!contractAddress) {
      throw new Error('TREASURY_CONTRACT_ADDRESS not found in environment')
    }
    
    console.log('✅ Environment loaded')
    console.log('Network:', network)
    console.log('Contract Address:', contractAddress)
    
    // Initialize TON client
    const endpoint = network === 'testnet' 
      ? 'https://testnet.toncenter.com/api/v2/jsonRPC'
      : 'https://toncenter.com/api/v2/jsonRPC'
    
    const client = new TonClient({
      endpoint,
      apiKey
    })
    
    console.log('✅ TON client initialized')
    
    // Check contract status
    const contractAddr = Address.parse(contractAddress)
    const treasury = Treasury.createFromAddress(contractAddr)
    const provider = client.provider(contractAddr)
    
    console.log('\n📋 Contract Information:')
    console.log('Address:', treasury.address.toString())
    
    try {
      // Get contract owner
      const owner = await treasury.getOwner(provider)
      console.log('Owner:', owner.toString())
      
      // Get upgrade authority
      const upgradeAuthority = await treasury.getUpgradeAuthority(provider)
      console.log('Upgrade Authority:', upgradeAuthority.toString())
      
      // Get airdrop pool balance
      const airdropPool = await treasury.getAirdropPool(provider)
      console.log('Airdrop Pool:', (Number(airdropPool) / 1_000_000_000).toFixed(4), 'TON')
      
      // Get current room ID
      const currentRoomId = await treasury.getCurrentRoomId(provider)
      console.log('Current Room ID:', currentRoomId)
      
      // Get house fee settings
      const houseFeeBps = await treasury.getHouseFeeBps(provider)
      const houseFeeDenominator = await treasury.getHouseFeeDenominator(provider)
      console.log('House Fee:', `${houseFeeBps}/${houseFeeDenominator} (${(houseFeeBps/houseFeeDenominator*100).toFixed(2)}%)`)
      
      console.log('\n✅ Contract is active and responding')
      
    } catch (error) {
      console.log('\n❌ Contract is not responding or not deployed')
      console.log('Error:', error.message)
    }
    
    // Check account state
    const account = await client.getContractState(contractAddr)
    console.log('\n📊 Account State:')
    console.log('State:', account.state)
    console.log('Balance:', (Number(account.balance) / 1_000_000_000).toFixed(4), 'TON')
    
    if (account.state === 'active') {
      console.log('✅ Contract is active and ready')
    } else if (account.state === 'uninitialized') {
      console.log('⚠️  Contract is not initialized')
    } else {
      console.log('❌ Contract state is unknown')
    }
    
    console.log('\n🔗 View on explorer:')
    console.log(`https://testnet.tonscan.org/address/${contractAddress}`)
    
  } catch (error: any) {
    console.error('❌ Status check failed:', error.message)
  }
}

async function showUpgradeInstructions() {
  console.log('\n🔄 Upgrade Instructions:')
  console.log('=' .repeat(30))
  console.log('1. Make your contract changes in contracts/Treasury.tact')
  console.log('2. Build the contract: npm run build')
  console.log('3. Run upgrade: npm run deploy:upgrade')
  console.log('4. Update your applications with the new contract address')
  console.log('5. Test the upgraded functionality')
}

// Run the status check
checkContractStatus()
  .then(() => showUpgradeInstructions())
  .catch(console.error)
