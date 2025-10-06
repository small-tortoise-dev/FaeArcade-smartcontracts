# TON Wallet Integration & Testnet Testing Guide

This guide will help you integrate a TON wallet and test your smart contracts on TON testnet.

## Prerequisites

- Node.js installed
- pnpm package manager
- TON testnet coins (get from @testgiver_ton_bot on Telegram)

## Step-by-Step Process

### Step 1: Setup Environment

1. **Copy environment file:**
   ```bash
   cp env.example .env
   ```

2. **Get TON Center API key:**
   - Visit: https://toncenter.com/
   - Get your API key
   - Update `TONCENTER_API_KEY` in `.env`

### Step 2: Setup Wallet

1. **Generate new wallet:**
   ```bash
   npm run setup:wallet
   ```
   
   This will:
   - Generate a new mnemonic phrase
   - Create a wallet address
   - Update your `.env` file
   - **SAVE THE MNEMONIC PHRASE SECURELY!**

2. **Fund your wallet:**
   - Send the generated wallet address to @testgiver_ton_bot on Telegram
   - Request testnet TON coins
   - Wait for confirmation

### Step 3: Deploy Contract

1. **Build contracts:**
   ```bash
   npm run build
   ```

2. **Deploy to testnet:**
   ```bash
   npm run deploy:testnet
   ```
   
   This will:
   - Deploy your Treasury contract
   - Show the contract address
   - Update your `.env` file with `TREASURY_ADDRESS`

### Step 4: Test Contract

1. **Test basic functionality:**
   ```bash
   npm run test:contract
   ```
   
   This will:
   - Connect to your deployed contract
   - Read contract data
   - Verify deployment

2. **Run automated tests:**
   ```bash
   npm test
   ```

### Step 5: View Transaction History

1. **TON Testnet Explorer:**
   - Visit: https://testnet.tonscan.org/
   - Search for your wallet address or contract address
   - View transaction history

2. **Wallet History:**
   - Use Tonkeeper, TonHub, or MyTonWallet
   - Import your wallet using the mnemonic phrase
   - View transaction history

## Available Scripts

- `npm run setup:wallet` - Generate new wallet
- `npm run build` - Build smart contracts
- `npm run deploy:testnet` - Deploy to testnet
- `npm run test:contract` - Test deployed contract
- `npm test` - Run automated tests

## Contract Functions

Your Treasury contract supports:
- `open_room` - Open a new game room
- `enter_paid` - Enter a paid room
- `close_room` - Close a room
- `payout_paid` - Distribute winnings
- `fund_airdrop` - Fund airdrop pool
- `payout_airdrop` - Distribute airdrops

## Troubleshooting

1. **"Insufficient balance" error:**
   - Get more testnet TON from @testgiver_ton_bot

2. **"Contract not found" error:**
   - Ensure contract is deployed: `npm run deploy:testnet`
   - Check `TREASURY_ADDRESS` in `.env`

3. **"API key invalid" error:**
   - Update `TONCENTER_API_KEY` in `.env`
   - Get new key from https://toncenter.com/

## Security Notes

- Never share your mnemonic phrase
- Use testnet for development only
- Test thoroughly before mainnet deployment
- Keep your `.env` file secure

## Next Steps

After successful testing:
1. Test all contract functions
2. Verify transaction history in explorer
3. Test edge cases and error conditions
4. Prepare for mainnet deployment

## Useful Links

- [TON Documentation](https://docs.ton.org/)
- [Tact Language](https://tact-lang.org/)
- [TON Testnet Explorer](https://testnet.tonscan.org/)
- [TON Center API](https://toncenter.com/)
- [Testnet Faucet](https://t.me/testgiver_ton_bot) 