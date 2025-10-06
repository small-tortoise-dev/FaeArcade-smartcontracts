#!/usr/bin/env tsx

import { Address } from 'ton-core'
import { 
  TREASURY_ADDRESS, 
  createMessageBody, 
  validateRoomId, 
  validateDay,
  TreasuryError 
} from './utils'

async function closeRoom(
  roomId: number,
  day: number
) {
  try {
    // Validate inputs
    if (!validateRoomId(roomId)) {
      throw new TreasuryError('Invalid room ID', 'INVALID_ROOM_ID')
    }
    
    if (!validateDay(day)) {
      throw new TreasuryError('Invalid day format', 'INVALID_DAY')
    }

    // Create message body
    const body = createMessageBody('close_room', [roomId, day])
    
    // Parse treasury address
    const treasuryAddress = Address.parse(TREASURY_ADDRESS)
    
    console.log('Close room prepared successfully!')
    console.log(`Room ID: ${roomId}`)
    console.log(`Day: ${day}`)
    console.log(`Treasury Address: ${treasuryAddress.toString()}`)
    console.log(`Message Body: ${body.toString()}`)
    
    console.log('\nTo actually close the room, you need to:')
    console.log('1. Use Tonkeeper wallet to send this message')
    console.log('2. Or use Blueprint for deployment')
    console.log('3. Or implement wallet integration')
    
    return {
      roomId,
      day,
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

if (args.length !== 2) {
  console.log('Usage: tsx closeRoom.ts <roomId> <day>')
  console.log('Example: tsx closeRoom.ts 12345 20241201')
  process.exit(1)
}

const [roomId, day] = args

closeRoom(
  parseInt(roomId),
  parseInt(day)
).catch(error => {
  console.error('Failed to close room:', error.message)
  process.exit(1)
}) 