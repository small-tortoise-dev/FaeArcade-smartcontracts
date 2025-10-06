import { Address, toNano, beginCell, Cell } from 'ton-core'
import { TonClient } from 'ton'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Environment variables
export const TREASURY_ADDRESS = process.env.TREASURY_ADDRESS!
export const NETWORK = process.env.NETWORK || 'testnet'
export const MNEMONIC = process.env.MNEMONIC!

// Network configuration
export const NETWORK_CONFIG = {
 testnet: {
 endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC'
 },
 mainnet: {
 endpoint: 'https://toncenter.com/api/v2/jsonRPC'
 }
}

// Initialize TON client
export function getTonClient(): TonClient {
 const config = NETWORK_CONFIG[NETWORK as keyof typeof NETWORK_CONFIG]
 return new TonClient({
 endpoint: config.endpoint
 })
}

// Helper to create room key
export function createRoomKey(roomId: number, day: number): bigint {
 return BigInt(roomId) + BigInt(day)
}

// Helper to create winners array
export function createWinnersArray(count: number): Address[] {
 const addresses: Address[] = []
 for (let i = 0; i < count; i++) {
 // Generate mock addresses for testing
 const mockAddress = Address.parse(`EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_${i.toString().padStart(2, '0')}`)
 addresses.push(mockAddress)
 }
 return addresses
}

// Helper to create linear weights array
export function createLinearWeights(count: number): number[] {
 const weights: number[] = []
 for (let i = 0; i < count; i++) {
 weights.push(count - i) // 1st place gets n, 2nd gets n-1, etc.
 }
 return weights
}

// Helper to validate linear weights
export function validateLinearWeights(weights: number[]): boolean {
 const n = weights.length
 const expectedSum = (n * (n + 1)) / 2
 const actualSum = weights.reduce((sum, weight) => sum + weight, 0)
 return actualSum === expectedSum
}

// Helper to create message body for contract calls
export function createMessageBody(method: string, params: any[]): Cell {
 const cell = beginCell()
 
 // Store method name
 cell.storeUint(0, 32) // op code for comment
 cell.storeStringTail(method)
 
 // Store parameters based on method
 switch (method) {
 case 'open_room':
 cell.storeUint(params[0], 256) // room_id
 cell.storeUint(params[1], 32) // day
 cell.storeCoins(params[2]) // entry_fee
 cell.storeUint(params[3], 32) // tier
 break
 
 case 'enter_paid':
 cell.storeUint(params[0], 256) // room_id
 cell.storeUint(params[1], 32) // day
 break
 
 case 'close_room':
 cell.storeUint(params[0], 256) // room_id
 cell.storeUint(params[1], 32) // day
 break
 
 case 'payout_paid':
 cell.storeUint(params[0], 256) // room_id
 cell.storeUint(params[1], 32) // day
 // winners and weights would be stored as slices
 break
 
 case 'payout_airdrop':
 // top and streak arrays would be stored as slices
 break
 
 case 'upgrade':
 cell.storeRef(params[0]) // new_code cell
 break
 }
 
 return cell.endCell()
}

// Error handling
export class TreasuryError extends Error {
 constructor(message: string, public code?: string) {
 super(message)
 this.name = 'TreasuryError'
 }
}

// Validation helpers
export function validateAddress(address: string): boolean {
 try {
 Address.parse(address)
 return true
 } catch {
 return false
 }
}

export function validateAmount(amount: string | number): boolean {
 const num = typeof amount === 'string' ? parseFloat(amount) : amount
 return num > 0 && isFinite(num)
}

export function validateRoomId(roomId: number): boolean {
 return Number.isInteger(roomId) && roomId > 0
}

export function validateDay(day: number): boolean {
 return Number.isInteger(day) && day >= 20240000 && day <= 20300000
}

export function validateTier(tier: number): boolean {
 return [1, 2, 3].includes(tier)
} 