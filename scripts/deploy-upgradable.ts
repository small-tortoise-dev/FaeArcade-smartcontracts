import { toNano, Address, beginCell } from '@ton/core'
import { NetworkProvider } from '@ton/blueprint'
import { Treasury } from '../wrappers/Treasury'

export async function run(provider: NetworkProvider) {
  console.log('🚀 Deploying Upgradable FAE Arcade Treasury Contract...')
  console.log('=' .repeat(60))
  
  try {
    // Get deployer address
    const deployerAddress = provider.sender().address
    if (!deployerAddress) {
      throw new Error('Wallet not connected')
    }
    const deployer = Address.parse(deployerAddress.toString())
    
    console.log('✅ Wallet connected:')
    console.log('Address:', deployer.toString())
    console.log('Network: testnet')
    
    // Check if this is an upgrade or initial deployment
    const isUpgrade = process.argv.includes('--upgrade')
    const existingContractAddress = process.env.TREASURY_ADDRESS
    
    if (isUpgrade && existingContractAddress) {
      console.log('\n🔄 UPGRADE MODE')
      console.log('Existing contract:', existingContractAddress)
      
      // For upgrades, we need to deploy a new contract with the same owner
      // but different upgrade authority (the deployer)
      const existingOwner = Address.parse("0QDOoeBGMtBp576nfJoEDAb6fVzBai0FxDBMTl6cv2tBvtzk")
      const newUpgradeAuthority = deployer
      
      console.log('Creating new contract instance for upgrade...')
      const treasury = await Treasury.fromInit(existingOwner, newUpgradeAuthority)
      
      console.log('\n📋 Upgrade Configuration:')
      console.log('Owner (unchanged):', existingOwner.toString())
      console.log('New Upgrade Authority:', newUpgradeAuthority.toString())
      console.log('New Contract Address:', treasury.address.toString())
      console.log('Previous Contract:', existingContractAddress)
      
      console.log('\n🚀 Deploying upgraded contract...')
      
      // Deploy new contract
      await provider.deploy(treasury, toNano('1.1'))
      
      console.log('✅ Upgrade deployment transaction sent!')
      console.log('⏳ Waiting for confirmation...')
      
      // Wait for deployment
      await provider.waitForDeploy(treasury.address)
      
      console.log('\n🎉 Treasury Contract Upgrade Deployed Successfully!')
      console.log('New Contract Address:', treasury.address.toString())
      console.log('Previous Contract:', existingContractAddress)
      console.log('Owner:', existingOwner.toString())
      console.log('New Upgrade Authority:', newUpgradeAuthority.toString())
      
      console.log('\n📝 Update your .env file:')
      console.log(`TREASURY_ADDRESS=${treasury.address.toString()}`)
      
      console.log('\n🔗 View new contract on explorer:')
      console.log(`https://testnet.tonscan.org/address/${treasury.address.toString()}`)
      
      console.log('\n⚠️  IMPORTANT UPGRADE NOTES:')
      console.log('1. Update your backend with the new contract address')
      console.log('2. Update your frontend with the new contract address')
      console.log('3. Migrate any pending transactions from the old contract')
      console.log('4. The old contract will remain active until you migrate all users')
      
      // Update .env file automatically for upgrade
      console.log('\n💾 Updating .env file...')
      const fs = require('fs')
      const path = require('path')
      
      const envPath = path.join(process.cwd(), '../.env')
      let envContent = ''
      
      if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8')
      }
      
      // Remove existing treasury address
      envContent = envContent.replace(/TREASURY_ADDRESS=.*\n/g, '')
      
      // Add new treasury address
      envContent += `\n# Treasury Contract Address (Upgraded)\n`
      envContent += `TREASURY_ADDRESS=${treasury.address.toString()}\n`
      
      fs.writeFileSync(envPath, envContent)
      console.log('✅ .env file updated with new contract address')
      
    } else {
      console.log('\n🆕 INITIAL DEPLOYMENT MODE')
      
      // Initial deployment - configure owner and upgrade authority
      // Use deployer as owner, but create a different upgrade authority to get a new contract address
      const ownerAddress = deployer
      const upgradeAuthorityAddress = Address.parse("0QDOoeBGMtBp576nfJoEDAb6fVzBai0FxDBMTl6cv2tBvtzk") // Different from deployer
      
      console.log('Creating initial contract instance...')
      const treasury = await Treasury.fromInit(ownerAddress, upgradeAuthorityAddress)
      
      console.log('\n📋 Initial Configuration:')
      console.log('Owner:', ownerAddress.toString())
      console.log('Upgrade Authority:', upgradeAuthorityAddress.toString())
      console.log('Contract Address:', treasury.address.toString())
      
      console.log('\n🚀 Deploying initial contract...')
      
      // Deploy with 1.1 TON
      await provider.deploy(treasury, toNano('1.1'))
      
      console.log('✅ Initial deployment transaction sent!')
      console.log('⏳ Waiting for confirmation...')
      
      // Wait for deployment
      await provider.waitForDeploy(treasury.address)
      
      console.log('\n🎉 Treasury Contract Deployed Successfully!')
      console.log('Contract Address:', treasury.address.toString())
      console.log('Owner:', ownerAddress.toString())
      console.log('Upgrade Authority:', upgradeAuthorityAddress.toString())
      
      console.log('\n📝 Add to your .env file:')
      console.log(`TREASURY_ADDRESS=${treasury.address.toString()}`)
      
      console.log('\n🔗 View on explorer:')
      console.log(`https://testnet.tonscan.org/address/${treasury.address.toString()}`)
      
      console.log('\n🔄 For future upgrades, use:')
      console.log('npm run deploy:upgrade')
      
      // Update .env file automatically for initial deployment
      console.log('\n💾 Updating .env file...')
      const fs = require('fs')
      const path = require('path')
      
      const envPath = path.join(process.cwd(), '../.env')
      let envContent = ''
      
      if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8')
      }
      
      // Remove existing treasury address
      envContent = envContent.replace(/TREASURY_ADDRESS=.*\n/g, '')
      
      // Add new treasury address
      envContent += `\n# Treasury Contract Address\n`
      envContent += `TREASURY_ADDRESS=${treasury.address.toString()}\n`
      
      fs.writeFileSync(envPath, envContent)
      console.log('✅ .env file updated with contract address')
    }
    
  } catch (error: any) {
    console.error('❌ Deployment failed:', error.message)
    console.log('\n🔧 Troubleshooting:')
    console.log('  1. Check your .env file has TONCENTER_API_KEY and MNEMONIC')
    console.log('  2. Make sure you have testnet TON in your wallet (at least 1.1 TON)')
    console.log('  3. Get testnet TON from @testgiver_ton_bot on Telegram')
    console.log('  4. For upgrades, ensure TREASURY_ADDRESS is set in .env')
  }
}
