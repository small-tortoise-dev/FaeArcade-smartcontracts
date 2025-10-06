import { execSync } from 'child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

console.log('Building Fae TON project...');

// Create build directory
const buildDir = join(process.cwd(), 'build');
try {
 mkdirSync(buildDir, { recursive: true });
} catch (error) {
 console.error('Failed to create build directory:', error);
 process.exit(1);
}

// Compile contracts using Tact compiler
const contracts = [
 'contracts/counter.tact',
 'contracts/Treasury.tact'
];

const compiledContracts: string[] = [];

for (const contract of contracts) {
 try {
 console.log(`Compiling ${contract}...`);
 
 // Compile without specifying output directory (use default)
 execSync(`npx tact ${contract}`, { stdio: 'inherit' });
 
 // Extract contract name from path
 const contractName = contract.split('/').pop()?.replace('.tact', '') || '';
 compiledContracts.push(contractName);
 console.log(`✓ ${contractName} compiled successfully`);
 } catch (error) {
 console.error(`✗ Failed to compile ${contract}:`, error);
 // Continue with other contracts
 }
}

// Create build info
const buildInfo = {
 timestamp: new Date().toISOString(),
 version: '1.0.0',
 contracts: compiledContracts,
 status: compiledContracts.length > 0 ? 'built' : 'failed',
 totalContracts: contracts.length,
 successfulCompilations: compiledContracts.length
};

const buildFile = join(buildDir, 'build-info.json');
writeFileSync(buildFile, JSON.stringify(buildInfo, null, 2));

if (compiledContracts.length > 0) {
 console.log('Build completed successfully!');
 console.log(`Build info written to: ${buildFile}`);
 console.log(`Successfully compiled ${compiledContracts.length}/${contracts.length} contracts`);
} else {
 console.error('Build failed: No contracts were compiled successfully');
 process.exit(1);
} 