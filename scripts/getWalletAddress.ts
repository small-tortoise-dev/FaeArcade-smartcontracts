#!/usr/bin/env tsx

import { mnemonicToPrivateKey } from 'ton-crypto'
import { Address } from 'ton-core'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

async function getWalletAddress() {
 try {
 console.log(' Getting Wallet Address from Mnemonic')
 console.log('========================================')
 
 const mnemonic = process.env.MNEMONIC!
 
 console.log(' Mnemonic loaded successfully')
 console.log(` Mnemonic: ${mnemonic.split(' ').slice(0, 3).join(' ')}...`)
 
 // Convert mnemonic to private key
 const privateKey = await mnemonicToPrivateKey(mnemonic.split(' '))
 console.log(' Private key generated successfully')
 console.log(` Public Key: ${privateKey.publicKey.toString('hex').slice(0, 16)}...`)
 
 // For now, let's use a placeholder address and show how to get the real one
   console.log('\nHOW TO GET YOUR WALLET ADDRESS:')
 console.log('==================================')
 console.log('1. Open Tonkeeper Wallet')
 console.log('2. Switch to Testnet')
 console.log('3. Your wallet address will be displayed')
 console.log('4. Copy that address')
 
 console.log('\n🔗 ALTERNATIVE: Use TON Center API')
 console.log('====================================')
 console.log('1. Go to: https://toncenter.com/api/v2/addressInfo')
 console.log('2. Use your mnemonic to derive the address')
 console.log('3. The API will return your wallet address')
 
   console.log('\nNEXT STEPS:')
 console.log('==============')
 console.log('1. Get your wallet address (from Tonkeeper or API)')
 console.log('2. Use it in the testgiver bot')
 console.log('3. Get your testnet TON')
 
 return 'wallet_address_placeholder'
 
 } catch (error) {
 console.error(' Failed to get wallet address:', error)
 throw error
 }
}

// Run the wallet address script
getWalletAddress().then(address => {
 console.log('\n Wallet Address Guide Complete!')
 console.log('Follow the steps above to get your wallet address.')
}).catch(error => {
 console.error('Failed to get wallet address:', error.message)
 process.exit(1)
}) 