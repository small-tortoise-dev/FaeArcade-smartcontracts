import { Address, toNano } from '@ton/core';
import { TonClient, WalletContractV4 } from '@ton/ton';
import { mnemonicToWalletKey } from '@ton/crypto';
import { TreasuryComplete, TreasuryCompleteConfig } from './wrappers/TreasuryComplete';

// Configuration
const NETWORK = process.env.TON_NETWORK || 'testnet';
const RPC_URL = process.env.TON_RPC_URL || 'https://testnet.toncenter.com/api/v2/jsonRPC';
const API_KEY = process.env.TON_API_KEY || '';
const WALLET_MNEMONIC = process.env.WALLET_MNEMONIC || '';

// Contract configuration
const OWNER_ADDRESS = process.env.OWNER_ADDRESS || '';
const UPGRADE_AUTHORITY_ADDRESS = process.env.UPGRADE_AUTHORITY_ADDRESS || '';

async function deployTreasuryContract() {
  console.log('🚀 Starting Treasury Contract Deployment');
  console.log(`Network: ${NETWORK}`);
  console.log(`RPC URL: ${RPC_URL}`);

  // Validate configuration
  if (!WALLET_MNEMONIC) {
    throw new Error('WALLET_MNEMONIC environment variable is required');
  }

  if (!OWNER_ADDRESS) {
    throw new Error('OWNER_ADDRESS environment variable is required');
  }

  if (!UPGRADE_AUTHORITY_ADDRESS) {
    throw new Error('UPGRADE_AUTHORITY_ADDRESS environment variable is required');
  }

  // Initialize TON client
  const tonClient = new TonClient({
    endpoint: RPC_URL,
    apiKey: API_KEY,
  });

  console.log('✅ TON client initialized');

  // Initialize wallet
  const walletKey = await mnemonicToWalletKey(WALLET_MNEMONIC.split(' '));
  const wallet = WalletContractV4.create({ workchain: 0, publicKey: walletKey.publicKey });
  const walletContract = tonClient.open(wallet);

  console.log(`✅ Wallet initialized: ${wallet.address.toString()}`);

  // Check wallet balance
  const balance = await walletContract.getBalance();
  console.log(`💰 Wallet balance: ${balance.toString()} nanoTON`);

  if (balance < toNano('0.1')) {
    throw new Error('Insufficient wallet balance. Need at least 0.1 TON for deployment.');
  }

  // Parse addresses
  const ownerAddress = Address.parse(OWNER_ADDRESS);
  const upgradeAuthorityAddress = Address.parse(UPGRADE_AUTHORITY_ADDRESS);

  console.log(`👤 Owner: ${ownerAddress.toString()}`);
  console.log(`🔧 Upgrade Authority: ${upgradeAuthorityAddress.toString()}`);

  // Create contract configuration
  const config: TreasuryCompleteConfig = {
    owner: ownerAddress,
    upgradeAuthority: upgradeAuthorityAddress,
  };

  // Note: In a real deployment, you would need the compiled contract code
  // For this example, we'll create a placeholder
  console.log('⚠️  Note: Contract code compilation is required for actual deployment');
  console.log('📝 Contract configuration created:');
  console.log(`   - Owner: ${config.owner.toString()}`);
  console.log(`   - Upgrade Authority: ${config.upgradeAuthority.toString()}`);

  // Simulate deployment process
  console.log('🔄 Simulating deployment process...');
  
  // In a real deployment, you would:
  // 1. Compile the contract code
  // 2. Create the contract instance
  // 3. Deploy the contract
  // 4. Wait for confirmation
  // 5. Verify deployment

  console.log('✅ Deployment simulation completed');
  console.log('📋 Next steps:');
  console.log('   1. Compile TreasuryComplete.tact contract');
  console.log('   2. Update contract code in deployment script');
  console.log('   3. Run actual deployment');
  console.log('   4. Update TREASURY_CONTRACT_ADDRESS in environment variables');
}

async function verifyContractDeployment(contractAddress: string) {
  console.log('🔍 Verifying contract deployment...');
  
  const tonClient = new TonClient({
    endpoint: RPC_URL,
    apiKey: API_KEY,
  });

  try {
    const contract = TreasuryComplete.createFromAddress(Address.parse(contractAddress));
    const openedContract = tonClient.open(contract);

    // Test getter methods
    const owner = await openedContract.getOwner();
    const upgradeAuthority = await openedContract.getUpgradeAuthority();
    const airdropPool = await openedContract.getAirdropPool();
    const houseFeeBps = await openedContract.getHouseFeeBps();

    console.log('✅ Contract verification successful:');
    console.log(`   - Contract Address: ${contractAddress}`);
    console.log(`   - Owner: ${owner.toString()}`);
    console.log(`   - Upgrade Authority: ${upgradeAuthority.toString()}`);
    console.log(`   - Airdrop Pool: ${airdropPool.toString()} nanoTON`);
    console.log(`   - House Fee BPS: ${houseFeeBps}`);

    return true;
  } catch (error) {
    console.error('❌ Contract verification failed:', error);
    return false;
  }
}

async function testContractOperations(contractAddress: string) {
  console.log('🧪 Testing contract operations...');
  
  const tonClient = new TonClient({
    endpoint: RPC_URL,
    apiKey: API_KEY,
  });

  const walletKey = await mnemonicToWalletKey(WALLET_MNEMONIC.split(' '));
  const wallet = WalletContractV4.create({ workchain: 0, publicKey: walletKey.publicKey });
  const walletContract = tonClient.open(wallet);

  const contract = TreasuryComplete.createFromAddress(Address.parse(contractAddress));
  const openedContract = tonClient.open(contract);

  try {
    // Test 1: Open a room
    console.log('📝 Testing room creation...');
    const roomKey = Date.now(); // Use timestamp as unique room key
    const entryFee = toNano('1'); // 1 TON
    const winnersCount = 100; // Low risk tier

    const sender = {
      address: wallet.address,
      send: async (args: any) => {
        await walletContract.sendTransfer({
          seqno: await walletContract.getSeqno(),
          secretKey: walletKey.secretKey,
          messages: [args],
        });
      }
    };

    await openedContract.sendOpenRoom(
      sender,
      toNano('0.1'), // Gas fee
      roomKey,
      entryFee,
      winnersCount
    );

    console.log(`✅ Room ${roomKey} created successfully`);

    // Test 2: Get room data
    console.log('📊 Testing room data retrieval...');
    const roomData = await openedContract.getRoomData(roomKey);
    
    if (roomData) {
      console.log('✅ Room data retrieved:');
      console.log(`   - Entry Fee: ${roomData.entryFee.toString()} nanoTON`);
      console.log(`   - Winners Count: ${roomData.winnersCount}`);
      console.log(`   - Status: ${roomData.status}`);
      console.log(`   - Pool: ${roomData.pool.toString()} nanoTON`);
    } else {
      console.log('⚠️  Room data not found (may need to wait for confirmation)');
    }

    // Test 3: Get Treasury state
    console.log('🏛️ Testing Treasury state retrieval...');
    const treasuryState = await openedContract.getTreasuryState();
    
    console.log('✅ Treasury state retrieved:');
    console.log(`   - Owner: ${treasuryState.owner}`);
    console.log(`   - Airdrop Pool: ${treasuryState.airdropPool}`);
    console.log(`   - Current Room ID: ${treasuryState.currentRoomId}`);
    console.log(`   - House Fee BPS: ${treasuryState.houseFeeBps}`);

    console.log('✅ All contract operations tested successfully');

  } catch (error) {
    console.error('❌ Contract operation test failed:', error);
  }
}

// Main execution
async function main() {
  try {
    await deployTreasuryContract();
    
    // If you have a deployed contract address, uncomment these lines:
    // const contractAddress = process.env.TREASURY_CONTRACT_ADDRESS;
    // if (contractAddress) {
    //   await verifyContractDeployment(contractAddress);
    //   await testContractOperations(contractAddress);
    // }

  } catch (error) {
    console.error('💥 Deployment failed:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main();
}

export {
  deployTreasuryContract,
  verifyContractDeployment,
  testContractOperations
};
