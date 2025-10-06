#!/usr/bin/env tsx

import { Address, toNano } from 'ton-core'
import { 
  TREASURY_ADDRESS, 
  createMessageBody, 
  validateRoomId, 
  validateDay, 
  validateAmount, 
  validateTier,
  TreasuryError 
} from './utils'

async function openRoom(
  roomId: number,
  day: number,
  entryFee: string | number,
  tier: number
) {
  try {
    // Validate inputs
    if (!validateRoomId(roomId)) {
      throw new TreasuryError('Invalid room ID', 'INVALID_ROOM_ID')
    }
    
    if (!validateDay(day)) {
      throw new TreasuryError('Invalid day format', 'INVALID_DAY')
    }
    
    if (!validateAmount(entryFee)) {
      throw new TreasuryError('Invalid entry fee', 'INVALID_ENTRY_FEE')
    }
    
    if (!validateTier(tier)) {
      throw new TreasuryError('Invalid risk tier (must be 1, 2, or 3)', 'INVALID_TIER')
    }

    // Convert entry fee to nano
    const entryFeeNano = typeof entryFee === 'string' ? toNano(entryFee) : BigInt(entryFee)
    
    // Create message body
    const body = createMessageBody('open_room', [roomId, day, entryFeeNano, tier])
    
    // Parse treasury address
    const treasuryAddress = Address.parse(TREASURY_ADDRESS)
    
    console.log('Room opening prepared successfully!')
    console.log(`Room ID: ${roomId}`)
    console.log(`Day: ${day}`)
    console.log(`Entry Fee: ${entryFee} TON`)
    console.log(`Risk Tier: ${tier}`)
    console.log(`Treasury Address: ${treasuryAddress.toString()}`)
    console.log(`Message Body: ${body.toString()}`)
    
    console.log('\nTo actually open the room, you need to:')
    console.log('1. Use Tonkeeper wallet to send this message')
    console.log('2. Or use Blueprint for deployment')
    console.log('3. Or implement wallet integration')
    
    return {
      roomId,
      day,
      entryFee: entryFeeNano,
      tier,
      treasuryAddress: treasuryAddress.toString(),
      messageBody: body.toString()
    }
    
  } catch (error) {
    if (error instanceof TreasuryError) {
      console.error(`Treasury Error: ${error.message}`)
      console.error(`Error Code: ${error.code}`)
    } else {
      console.error('Unexpected error:', error)
    }
    throw error
  }
}

// CLI usage
const args = process.argv.slice(2)

if (args.length !== 4) {
  console.log('Usage: tsx openRoom.ts <roomId> <day> <entryFee> <tier>')
  console.log('Example: tsx openRoom.ts 12345 20241201 1.0 1')
  console.log('')
  console.log('Risk Tiers:')
  console.log('  1 = Low Risk (100 winners)')
  console.log('  2 = Medium Risk (50 winners)')
  console.log('  3 = High Risk (20 winners)')
  process.exit(1)
}

const [roomId, day, entryFee, tier] = args

openRoom(
  parseInt(roomId),
  parseInt(day),
  parseFloat(entryFee),
  parseInt(tier)
).catch(error => {
  console.error('Failed to open room:', error.message)
  process.exit(1)
})

export { openRoom } 