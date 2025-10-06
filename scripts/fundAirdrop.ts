#!/usr/bin/env tsx

import { Address, toNano } from 'ton-core'
import { 
 TREASURY_ADDRESS, 
 validateAmount,
 TreasuryError 
} from './utils'

async function fundAirdrop(
 amount: string | number
) {
 try {
 // Validate inputs
 if (!validateAmount(amount)) {
 throw new TreasuryError('Invalid amount', 'INVALID_AMOUNT')
 }

 // Convert amount to nano
 const amountNano = typeof amount === 'string' ? toNano(amount) : toNano(amount.toString())
 
 // Parse treasury address
 const treasuryAddress = Address.parse(TREASURY_ADDRESS)
 
 console.log(' Fund airdrop prepared successfully!')
 console.log(` Amount: ${amount} TON`)
 console.log(` Treasury Address: ${treasuryAddress.toString()}`)
 console.log(` Note: Send TON directly to the treasury address to fund airdrop pool`)
 
 console.log('\n To actually fund the airdrop pool, you need to:')
 console.log('1. Use Tonkeeper wallet to send TON to the treasury address')
 console.log('2. Or use Blueprint for deployment')
 console.log('3. Or implement wallet integration')
 
 return {
 amount: amountNano,
 treasuryAddress: treasuryAddress.toString()
 }
 
 } catch (error) {
 if (error instanceof TreasuryError) {
 console.error(` Treasury Error: ${error.message}`)
 console.error(` Error Code: ${error.code}`)
 } else {
 console.error(' Unexpected error:', error)
 }
 throw error
 }
}

// CLI usage
const args = process.argv.slice(2)

if (args.length !== 1) {
 console.log('Usage: tsx fundAirdrop.ts <amount>')
 console.log('Example: tsx fundAirdrop.ts 10.5')
 process.exit(1)
}

const [amount] = args

fundAirdrop(parseFloat(amount)).catch(error => {
 console.error('Failed to fund airdrop:', error.message)
 process.exit(1)
}) 