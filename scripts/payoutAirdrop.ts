#!/usr/bin/env tsx

import { Address } from 'ton-core'
import { 
 TREASURY_ADDRESS, 
 createMessageBody,
 TreasuryError 
} from './utils'

async function payoutAirdrop(
 topWinnersCount: number,
 streakWinnersCount: number
) {
 try {
 // Validate inputs
 if (topWinnersCount < 0) {
 throw new TreasuryError('Top winners count cannot be negative', 'INVALID_TOP_WINNERS_COUNT')
 }
 
 if (streakWinnersCount < 0) {
 throw new TreasuryError('Streak winners count cannot be negative', 'INVALID_STREAK_WINNERS_COUNT')
 }

 if (topWinnersCount === 0 && streakWinnersCount === 0) {
 throw new TreasuryError('At least one winner category must be specified', 'NO_WINNERS_SPECIFIED')
 }

 // Create message body
 const body = createMessageBody('payout_airdrop', [])
 
 // Parse treasury address
 const treasuryAddress = Address.parse(TREASURY_ADDRESS)
 
 console.log(' Payout airdrop prepared successfully!')
 console.log(`🏆 Top Winners Count: ${topWinnersCount}`)
 console.log(`🔥 Streak Winners Count: ${streakWinnersCount}`)
 console.log(` Treasury Address: ${treasuryAddress.toString()}`)
 console.log(` Message Body: ${body.toString()}`)
 
 console.log('\n To actually payout airdrop winners, you need to:')
 console.log('1. Use Tonkeeper wallet to send this message')
 console.log('2. Or use Blueprint for deployment')
 console.log('3. Or implement wallet integration')
 
 return {
 topWinnersCount,
 streakWinnersCount,
 treasuryAddress: treasuryAddress.toString(),
 messageBody: body.toString()
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

if (args.length !== 2) {
 console.log('Usage: tsx payoutAirdrop.ts <topWinnersCount> <streakWinnersCount>')
 console.log('Example: tsx payoutAirdrop.ts 5 3')
 process.exit(1)
}

const [topWinnersCount, streakWinnersCount] = args

payoutAirdrop(
 parseInt(topWinnersCount),
 parseInt(streakWinnersCount)
).catch(error => {
 console.error('Failed to payout airdrop:', error.message)
 process.exit(1)
}) 