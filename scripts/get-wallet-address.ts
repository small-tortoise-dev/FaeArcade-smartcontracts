import { Address, WalletContractV4 } from '@ton/ton';
import { mnemonicToWalletKey } from '@ton/crypto';

async function main() {
  // Get mnemonic from environment or prompt
  const mnemonic = process.env.WALLET_MNEMONIC;
  
  if (!mnemonic) {
    console.error('❌ WALLET_MNEMONIC environment variable not set');
    console.log('\nUsage:');
    console.log('  WALLET_MNEMONIC="word1 word2 ... word24" npx tsx scripts/get-wallet-address.ts');
    process.exit(1);
  }

  console.log('🔑 Computing wallet address from mnemonic...\n');

  // Convert mnemonic to key pair
  const keyPair = await mnemonicToWalletKey(mnemonic.split(' '));
  
  // Create wallet contract V4
  const wallet = WalletContractV4.create({ 
    workchain: 0, 
    publicKey: keyPair.publicKey 
  });

  console.log('✅ Wallet Address (Bounceable):');
  console.log(wallet.address.toString({ bounceable: true }));
  
  console.log('\n✅ Wallet Address (Non-Bounceable):');
  console.log(wallet.address.toString({ bounceable: false }));
  
  console.log('\n📋 Use this address as contract owner when deploying\n');
}

main().catch(console.error);

