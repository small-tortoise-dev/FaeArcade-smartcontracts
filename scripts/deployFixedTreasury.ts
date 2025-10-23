import { toNano, Address } from '@ton/core';
import { Treasury } from '../contracts/Treasury.tact_Treasury';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const ui = provider.ui();
    const sender = provider.sender();
    
    // Get deployer address
    const deployerAddress = provider.sender().address;
    if (!deployerAddress) {
        throw new Error('❌ Wallet not connected');
    }
    
    const deployer = Address.parse(deployerAddress.toString());
    console.log('✅ Wallet:', deployer.toString({bounceable: false}));
    
    // Create Treasury instance
    console.log('\n📝 Creating Treasury contract...');
    const treasury = provider.open(
        await Treasury.fromInit(deployer, deployer)
    );
    
    console.log('✅ Contract address:', treasury.address.toString({bounceable: false}));
    console.log('   Owner:', deployer.toString({bounceable: false}));
    console.log('   Upgrade Authority:', deployer.toString({bounceable: false}));
    
    // Check if already deployed
    const isDeployed = await provider.isContractDeployed(treasury.address);
    if (isDeployed) {
        console.log('\n⚠️  Contract already deployed!');
        console.log('Address:', treasury.address.toString({bounceable: false}));
        return;
    }
    
    // Deploy
    console.log('\n🚀 Deploying contract...');
    console.log('   Amount: 1.1 TON');
    
    await treasury.send(
        sender,
        { value: toNano('1.1') },
        { $$type: 'Deploy', queryId: 0n }
    );
    
    console.log('⏳ Waiting for deployment...');
    await provider.waitForDeploy(treasury.address);
    
    console.log('\n✅ Treasury deployed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 Contract Details:');
    console.log('   Address:', treasury.address.toString({bounceable: false}));
    console.log('   Owner:', deployer.toString({bounceable: false}));
    console.log('   Network: Testnet');
    console.log('\n🔗 View on Explorer:');
    console.log(`   https://testnet.tonscan.org/address/${treasury.address.toString({bounceable: false})}`);
    console.log('\n📝 Add to your .env files:');
    console.log(`   TREASURY_CONTRACT_ADDRESS=${treasury.address.toString({bounceable: false})}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}
