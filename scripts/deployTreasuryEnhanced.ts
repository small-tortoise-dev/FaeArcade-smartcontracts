import { toNano, Address, beginCell } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
  console.log('🚀 Deploying Enhanced Treasury Contract via Blueprint');
  console.log('=====================================================');
  
  try {
    // Get deployer address and ensure it's properly formatted
    const deployerAddress = provider.sender().address;
    if (!deployerAddress) {
      throw new Error('Wallet not connected');
    }
    const deployer = Address.parse(deployerAddress.toString());
    console.log('✅ Wallet connected:');
    console.log('Address:', deployer.toString());
    console.log('Network: testnet');
    
    // Import TreasuryEnhanced wrapper
    const { TreasuryEnhanced } = await import('../wrappers/TreasuryEnhanced');
    
    // Create TreasuryEnhanced contract instance using the wrapper
    const treasury = await TreasuryEnhanced.fromInit(deployer, deployer);
    
    console.log('\n📋 Contract Configuration:');
    console.log('Owner:', deployer.toString());
    console.log('Upgrade Authority:', deployer.toString());
    console.log('Initial Balance: 1 TON');
    
    console.log('\n🔧 Deployment Details:');
    console.log('Contract Address:', treasury.address.toString());
    console.log('Has init:', !!treasury.init);
    
    if (!treasury.init) {
      throw new Error('TreasuryEnhanced init is missing');
    }
    
    console.log('\n📝 Starting deployment...');
    console.log('1. ✅ Contract compiled');
    console.log('2. ✅ Initial data created');
    console.log('3. ✅ StateInit prepared');
    console.log('4. 🚀 Executing deployment...');
    
    // Execute deployment transaction
    const deploymentValue = toNano('1.1'); // 1 TON + gas
    
    console.log('\n💸 Sending deployment transaction...');
    console.log('Amount:', deploymentValue, 'nanoTON');
    console.log('To:', treasury.address.toString());
    
    // Send deployment transaction using provider.deploy
    await provider.deploy(treasury, toNano('1.1'));
    
    console.log('\n🎉 Enhanced Treasury Contract deployed successfully!');
    console.log('=====================================================');
    console.log('Contract Address:', treasury.address.toString());
    console.log('Network: testnet');
    console.log('Owner:', deployer.toString());
    
    console.log('\n📋 Enhanced Features:');
    console.log('✅ Dynamic airdrop distribution');
    console.log('✅ Parsed winner addresses from message body');
    console.log('✅ 50/50 pool split (top scorers / streak winners)');
    console.log('✅ Airdrop ID tracking');
    console.log('✅ Backward compatibility with legacy payout_airdrop');
    
    console.log('\n🔗 Integration:');
    console.log('1. Update TREASURY_CONTRACT_ADDRESS in your .env file:');
    console.log(`   TREASURY_CONTRACT_ADDRESS=${treasury.address.toString()}`);
    console.log('');
    console.log('2. The backend will automatically use the enhanced contract');
    console.log('   for dynamic airdrop distributions');
    console.log('');
    console.log('3. Legacy contracts will continue to work with payout_airdrop');
    
    console.log('\n📊 Contract State:');
    const openedContract = provider.open(treasury);
    try {
      const state = await openedContract.getTreasuryState();
      console.log('Owner:', state.owner);
      console.log('Airdrop Pool:', state.airdropPool, 'nanoTON');
      console.log('Airdrop ID:', state.airdropId);
      console.log('Current Room Status:', state.currentRoom.status);
      console.log('House Fee:', state.houseFeeBps, 'bps');
    } catch (error) {
      console.log('⚠️ Could not fetch contract state (contract may still be initializing)');
    }
    
    console.log('\n🎯 Next Steps:');
    console.log('1. Fund the airdrop pool using fund_airdrop');
    console.log('2. Test airdrop distribution with distribute_airdrop');
    console.log('3. Monitor airdrop events in your backend logs');
    
  } catch (error) {
    console.error('\n❌ Deployment failed:', error);
    throw error;
  }
}
