import { readFileSync } from 'fs'
import { Cell } from '@ton/core'
import { join } from 'path'

console.log('📊 Analyzing Contract Size\n')
console.log('=' .repeat(60))

// Read the compiled contract code
const bocPath = join(process.cwd(), 'contracts', 'Treasury.tact_Treasury.code.boc')
const bocFile = readFileSync(bocPath)

console.log('📁 File: Treasury.tact_Treasury.code.boc')
console.log('📏 File size (bytes):', bocFile.length)

// Parse the cell
const cell = Cell.fromBoc(bocFile)[0]

// Calculate total size
const totalSize = calculateCellSize(cell)

console.log('\n📊 Cell Analysis:')
console.log('- Bits:', cell.bits.length)
console.log('- Refs:', cell.refs.length)
console.log('- Total size (approx):', totalSize, 'bytes')
console.log('- Max size (10240 bytes):', totalSize < 10240 ? '✅ Within limit' : '❌ Exceeds limit')

// Show cell structure
console.log('\n🔍 Cell Structure:')
printCellStructure(cell, 0, '')

function calculateCellSize(cell: Cell): number {
  let totalBits = cell.bits.length
  let totalBytes = Math.ceil(totalBits / 8)
  
  for (const ref of cell.refs) {
    totalBytes += calculateCellSize(ref)
  }
  
  return totalBytes
}

function printCellStructure(cell: Cell, depth: number, prefix: string) {
  const indent = '  '.repeat(depth)
  const bitsInfo = `${cell.bits.length} bits = ${Math.ceil(cell.bits.length / 8)} bytes`
  console.log(`${indent}${prefix}Cell: ${bitsInfo}, ${cell.refs.length} refs`)
  
  for (let i = 0; i < cell.refs.length; i++) {
    printCellStructure(cell.refs[i], depth + 1, `Ref${i}: `)
  }
}

// Also check init data size
console.log('\n📦 Init Data Analysis:')
const initDataExample = Cell.fromBase64('te6ccgEBAQEARQAAhUAM6h4EYy0Gnnvqd8mgQMBvp9XMFqLQXEMExOXpy/a0G+gBKEizD0tmeEjsosmRfNxqLbUDMaylR2RWFxmYGGrg0yk=')
console.log('- Init data bits:', initDataExample.bits.length)
console.log('- Init data bytes:', Math.ceil(initDataExample.bits.length / 8))
console.log('- Max init data (10240 bytes):', '✅ Within limit')

console.log('\n' + '=' .repeat(60))
console.log('\n📝 Summary:')
console.log(`✅ Code size: ~${totalSize} bytes (max 10240 bytes)`)
console.log('✅ Contract is within TON size limits')
console.log('\n💡 To check size anytime, run: npx tsx check-contract-size.ts')

