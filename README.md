# Fae Arcade Treasury Smart Contract

Production-ready TON smart contract for the Fae Arcade game platform.

## Overview

The Treasury contract manages game rooms, entry fees, and prize distributions for the Fae Arcade compete mode. It handles:

- Room creation and management
- Entry fee collection
- Prize pool distribution
- House fee collection
- Refund processing

## Contract Features

- **Room Management**: Create, open, and close game rooms
- **Entry Processing**: Handle player entry fees with gas buffer
- **Prize Distribution**: Distribute winnings to top players
- **House Fees**: Collect 2.5% house fee on all entries
- **Refund System**: Automatic refund of excess payments
- **Security**: Owner-controlled operations with upgrade authority

## Deployment

### Prerequisites

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```env
TONCENTER_API_KEY=your_api_key
MNEMONIC="your wallet mnemonic phrase"
```

### Deploy to Testnet

```bash
npm run deploy:testnet
```

### Deploy to Mainnet

```bash
npm run deploy:mainnet
```

## Contract Addresses

- **Testnet**: `EQCM4_zgg4HZpapFP5x_9rsCOF0ktQYH6olHMV7GFzZj1S2P`
- **Mainnet**: `[To be deployed]`

## Usage

### Frontend Integration

```typescript
import { Treasury } from './wrappers/Treasury'

// Initialize contract
const treasury = await Treasury.fromInit(ownerAddress, upgradeAuthorityAddress)

// Open a room
await treasury.sendOpenRoom(provider, {
  roomKey: 2025012401,
  entryFee: toNano('1.0'),
  winnersCount: 100
})

// Enter a room
await treasury.sendEnterRoom(provider, {
  roomKey: 2025012401,
  entryFee: toNano('1.0')
})
```

### Backend Integration

```typescript
// Room key generation
function generateRoomKey(date: Date, riskTier: string): number {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  
  const tierMultiplier = { low: 1, medium: 2, high: 3 }[riskTier] || 1
  const baseKey = year * 10000 + month * 100 + day
  return baseKey * 10 + tierMultiplier
}
```

## Contract Methods

### Room Management
- `open_room_params(roomKey, entryFee, winnersCount)` - Create new room
- `close_room_params(roomKey)` - Close existing room
- `get_room_data(roomKey)` - Get room information

### Player Actions
- `enter_room_params(roomKey, entryFee)` - Enter a room
- `enter_paid(roomKey)` - Enter with simple TON transfer

### Admin Functions
- `payout_room_params(roomKey, winners)` - Distribute prizes
- `withdraw_house_fees()` - Withdraw collected house fees

## Security Considerations

- Owner address controls critical functions
- Upgrade authority can modify contract (if needed)
- All operations include proper validation
- Gas fees are handled automatically
- Refunds prevent overpayment issues

## Gas Fees

- **Room Creation**: 0.2 TON
- **Room Entry**: Entry fee + 0.1 TON gas buffer
- **Payouts**: 0.1 TON per transaction
- **House Fee Withdrawal**: 0.1 TON

## Support

For issues or questions, contact the development team.

## License

Private - Fae Arcade Platform