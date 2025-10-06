import { toNano, Address } from 'ton-core'
import { NetworkProvider } from '@ton/blueprint'
import { Treasury } from '../wrappers/Treasury'
import * as dotenv from 'dotenv'

dotenv.config()

export async function run(provider: NetworkProvider) {
  console.log('🧪 Testing Treasury Contract')
  console.log('============================')
  
  const treasuryAddress = process.env.TREASURY_ADDRESS
  if (!treasuryAddress) {
    console.log('❌ TREASURY_ADDRESS not found in .env')
    console.log('Run: npm run deploy:testnet first')
    return
  }
  
  console.log('Treasury address:', treasuryAddress)
  
  try {
    // Open Treasury contract
    const treasury = provider.open(
      Treasury.createFromAddress(Address.parse(treasuryAddress))
    )
    
    console.log('✅ Treasury contract opened successfully!')
    console.log('Contract address:', treasury.address)
    
    // Test getting contract data
    console.log('\n📊 Getting contract data...')
    try {
      const owner = await treasury.getOwner(provider)
      console.log('Owner:', owner)
      
      const upgradeAuthority = await treasury.getUpgradeAuthority(provider)
      console.log('Upgrade Authority:', upgradeAuthority)
      
      const houseFeeBps = await treasury.getHouseFeeBps(provider)
      console.log('House Fee (BPS):', houseFeeBps)
      
    } catch (error) {
      console.log('⚠️ Some getter methods failed (contract may not be fully deployed):', error)
    }
    
    console.log('\n🎯 Ready for transactions!')
    console.log('Use the contract methods to interact with your Treasury')
    
  } catch (error) {
    console.log('❌ Error testing contract:', error)
  }
} 