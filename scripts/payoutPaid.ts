#!/usr/bin/env tsx

import { Address } from 'ton-core'
import { 
 TREASURY_ADDRESS, 
 createMessageBody, 
 validateRoomId, 
 validateDay,
 TreasuryError 
} from './utils'

async function payoutPaid(
 roomId: number,
 day: number,
 winnersCount: number
) {
 try {
 // Validate inputs
 if (!validateRoomId(roomId)) {
 throw new TreasuryError('Invalid room ID', 'INVALID_ROOM_ID')
 }
 
 if (!validateDay(day)) {
 throw new TreasuryError('Invalid day format', 'INVALID_DAY')
 }

 if (winnersCount <= 0) {
 throw new TreasuryError('Winners count must be positive', 'INVALID_WINNERS_COUNT')
 }

 // Create message body
 const body = createMessageBody('payout_paid', [roomId, day])
 
 // Parse treasury address
 const treasuryAddress = Address.parse(TREASURY_ADDRESS)
 
 console.log(' Payout paid prepared successfully!')
 console.log(` Room ID: ${roomId}`)
 console.log(` Day: ${day}`)
 console.log(`🏆 Winners Count: ${winnersCount}`)
 console.log(` Treasury Address: ${treasuryAddress.toString()}`)
 console.log(` Message Body: ${body.toString()}`)
 
 console.log('\n To actually payout winners, you need to:')
 console.log('1. Use Tonkeeper wallet to send this message')
 console.log('2. Or use Blueprint for deployment')
 console.log('3. Or implement wallet integration')
 
 return {
 roomId,
 day,
 winnersCount,
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

if (args.length !== 3) {
 console.log('Usage: tsx payoutPaid.ts <roomId> <day> <winnersCount>')
 console.log('Example: tsx payoutPaid.ts 12345 20241201 3')
 process.exit(1)
}

const [roomId, day, winnersCount] = args

payoutPaid(
 parseInt(roomId),
 parseInt(day),
 parseInt(winnersCount)
).catch(error => {
 console.error('Failed to payout winners:', error.message)
 process.exit(1)
}) 