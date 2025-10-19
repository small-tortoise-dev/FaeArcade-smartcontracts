import { toNano, Address, beginCell, internal } from '@ton/core'
import { TonClient, WalletContractV4 } from '@ton/ton'
import { mnemonicToWalletKey } from '@ton/crypto'
import { Treasury } from '../wrappers/Treasury'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

async function deploy() {
  console.log('🚀 Deploying FAE Arcade Treasury Contract...')
  console.log('=' .repeat(50))
  
  try {
    // Configuration
    const NETWORK = 'testnet'
    const TONCENTER_API_KEY = process.env.TONCENTER_API_KEY!
    const MNEMONIC = process.env.MNEMONIC!
    
    // Initialize client
    const client = new TonClient({
      endpoint: `https://${NETWORK}.toncenter.com/api/v2/jsonRPC`,
      apiKey: TONCENTER_API_KEY,
    })
    
    // Generate wallet
    const key = await mnemonicToWalletKey(MNEMONIC.split(' '))
    const wallet = WalletContractV4.create({ workchain: 0, publicKey: key.publicKey })
    const walletContract = client.open(wallet)
    
    // Check balance
    const balance = await walletContract.getBalance()
    console.log(`💰 Wallet balance: ${balance.toString()} nanoTON`)
    console.log(`📱 Wallet address: ${wallet.address.toString()}`)
    
    if (balance < toNano('1.1')) {
      console.log('⚠️  Low balance! Get testnet TON from @testgiver_ton_bot')
      return
    }
    
    // Create Treasury contract
    const treasury = await Treasury.fromInit(wallet.address, wallet.address)
    console.log(`📍 Contract address: ${treasury.address.toString()}`)
    
    // Deploy contract
    console.log('\n🚀 Deploying contract...')
    
    // Use the provider pattern from Blueprint
    const provider = {
      deploy: async (contract: any, value: bigint) => {
        await walletContract.send(internal({
          to: contract.address,
          value: value,
          init: contract.init,
          body: beginCell().endCell(),
          bounce: false
        }))
      },
      waitForDeploy: async (address: Address) => {
        // Wait for contract to be deployed
        let attempts = 0
        while (attempts < 30) {
          try {
            const state = await client.getContractState(address)
            if (state.state === 'active') {
              return
            }
          } catch (e) {
            // Contract not ready yet
          }
          await new Promise(resolve => setTimeout(resolve, 2000))
          attempts++
        }
      }
    }
    
    await provider.deploy(treasury, toNano('1.1'))
    console.log('✅ Deployment transaction sent!')
    
    await provider.waitForDeploy(treasury.address)
    console.log('✅ Contract deployed successfully!')
    
    // Test contract
    try {
      const owner = await treasury.getOwner(client.provider(treasury.address))
      console.log('✅ Contract is active!')
      console.log(`👤 Owner: ${owner.toString()}`)
    } catch (error) {
      console.log('⚠️  Contract may still be deploying...')
    }
    
    // Summary
    console.log('\n🎉 Deployment Summary:')
    console.log('=' .repeat(50))
    console.log(`📱 Wallet: ${wallet.address.toString()}`)
    console.log(`📍 Contract: ${treasury.address.toString()}`)
    console.log(`💰 Balance: ${balance.toString()} nanoTON`)
    
    console.log('\n🔗 Explorer Links:')
    console.log(`  Contract: https://testnet.tonscan.org/address/${treasury.address.toString()}`)
    console.log(`  Wallet: https://testnet.tonscan.org/address/${wallet.address.toString()}`)
    
    // Update .env file
    console.log('\n💾 Updating .env file...')
    const fs = require('fs')
    const path = require('path')
    
    const envPath = path.join(process.cwd(), '.env')
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
    console.log('✅ .env file updated!')
    
    console.log('\n📝 Add to your .env file:')
    console.log(`TREASURY_ADDRESS=${treasury.address.toString()}`)
    
  } catch (error) {
    console.error('❌ Deployment failed:', error)
  }
}

deploy()
