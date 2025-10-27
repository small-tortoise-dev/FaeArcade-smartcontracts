import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'

console.log('🔍 Verifying Deployment Readiness...')
console.log('='.repeat(60))

let allChecksPassed = true
const issues: string[] = []

// Check 1: TypeScript compilation
console.log('\n1️⃣  Checking TypeScript compilation...')
try {
  execSync('npx tsc --noEmit', { stdio: 'pipe' })
  console.log('   ✅ TypeScript compilation: PASSED')
} catch (error) {
  console.log('   ❌ TypeScript compilation: FAILED')
  issues.push('TypeScript has compilation errors')
  allChecksPassed = false
}

// Check 2: Contract build
console.log('\n2️⃣  Checking contract build...')
try {
  const contractFiles = [
    'contracts/Treasury.tact_Treasury.ts',
    'contracts/Treasury.tact_Treasury.abi',
    'contracts/Treasury.tact_Treasury.code.boc',
  ]
  
  let allFilesExist = true
  for (const file of contractFiles) {
    if (!fs.existsSync(path.join(process.cwd(), file))) {
      allFilesExist = false
      issues.push(`Missing contract file: ${file}`)
    }
  }
  
  if (allFilesExist) {
    console.log('   ✅ Contract artifacts: PRESENT')
  } else {
    console.log('   ❌ Contract artifacts: MISSING')
    console.log('   💡 Run: npm run build')
    allChecksPassed = false
  }
} catch (error) {
  console.log('   ❌ Contract build check: FAILED')
  allChecksPassed = false
}

// Check 3: Environment variables
console.log('\n3️⃣  Checking environment variables...')
const envPath = path.join(process.cwd(), '.env')
if (!fs.existsSync(envPath)) {
  console.log('   ❌ .env file: NOT FOUND')
  issues.push('.env file is missing')
  allChecksPassed = false
} else {
  const envContent = fs.readFileSync(envPath, 'utf8')
  
  const hasWalletMnemonic = envContent.includes('WALLET_MNEMONIC=')
  const hasWalletVersion = envContent.includes('WALLET_VERSION=')
  
  if (hasWalletMnemonic && hasWalletVersion) {
    console.log('   ✅ Environment variables: CONFIGURED')
  } else {
    console.log('   ❌ Environment variables: INCOMPLETE')
    if (!hasWalletMnemonic) issues.push('WALLET_MNEMONIC is missing in .env')
    if (!hasWalletVersion) issues.push('WALLET_VERSION is missing in .env')
    allChecksPassed = false
  }
}

// Check 4: Wrapper fix for exit code 130
console.log('\n4️⃣  Checking exit code 130 fix...')
const wrapperPath = path.join(process.cwd(), 'wrappers/Treasury.ts')
if (fs.existsSync(wrapperPath)) {
  const wrapperContent = fs.readFileSync(wrapperPath, 'utf8')
  
  if (wrapperContent.includes('MANUAL FIX') && wrapperContent.includes('storeTreasury$Data')) {
    console.log('   ✅ Exit code 130 fix: IMPLEMENTED')
  } else {
    console.log('   ⚠️  Exit code 130 fix: NOT FOUND')
    issues.push('Wrapper may not have the exit code 130 fix')
    allChecksPassed = false
  }
} else {
  console.log('   ❌ Wrapper file: NOT FOUND')
  issues.push('wrappers/Treasury.ts is missing')
  allChecksPassed = false
}

// Check 5: Deployment scripts
console.log('\n5️⃣  Checking deployment scripts...')
const deployScripts = [
  'scripts/deploy.ts',
  'scripts/deploy-upgradable.ts',
  'scripts/check-status.ts',
]

let allScriptsExist = true
for (const script of deployScripts) {
  if (!fs.existsSync(path.join(process.cwd(), script))) {
    allScriptsExist = false
    issues.push(`Missing script: ${script}`)
  }
}

if (allScriptsExist) {
  console.log('   ✅ Deployment scripts: PRESENT')
} else {
  console.log('   ❌ Deployment scripts: MISSING')
  allChecksPassed = false
}

// Final summary
console.log('\n' + '='.repeat(60))
if (allChecksPassed) {
  console.log('✅ ALL CHECKS PASSED - READY FOR DEPLOYMENT!')
  console.log('\n🚀 Next steps:')
  console.log('   1. Run: npm run deploy:testnet')
  console.log('   2. Verify: npm run check:status')
  console.log('   3. Update backend .env with contract address')
  process.exit(0)
} else {
  console.log('❌ SOME CHECKS FAILED - PLEASE FIX ISSUES BELOW')
  console.log('\n🔧 Issues found:')
  issues.forEach((issue, index) => {
    console.log(`   ${index + 1}. ${issue}`)
  })
  console.log('\n💡 Recommendations:')
  console.log('   - Run: npm run build')
  console.log('   - Check your .env file')
  console.log('   - Verify all files are present')
  process.exit(1)
}
