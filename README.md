# FAE Arcade Treasury - TON Smart Contract

> **Upgradeable Treasury Contract for FAE Arcade Gaming Platform**

A sophisticated smart contract system managing paid game rooms, linear weighted payouts, and weekly airdrops on TON blockchain.

## Overview

FAE Arcade Treasury is a production-ready smart contract that manages the economic layer of the FAE Arcade gaming platform. It handles paid game rooms with risk-based tiers, implements linear weighted payout systems, and manages weekly airdrop distributions.

## Game Modes

### Free Mode (Airdrop)
- **Weekly Distribution**: 50% top scorers + 50% streak winners
- **Equal Splits**: Even distribution within each category
- **Community Funded**: Accepts contributions from users and platform

### Paid Mode (Game Rooms)
- **Entry Fees**: Configurable per room (typically 1-10 TON)
- **House Fee**: 2.5% of entry fees
- **Risk Tiers**: 
  - Low Risk: 100 winners (Tier 1)
  - Medium Risk: 50 winners (Tier 2) 
  - High Risk: 20 winners (Tier 3)

## Mathematical Foundation

### Linear Weighted Payout System

The Treasury uses a sophisticated linear weight distribution where higher ranks receive proportionally more rewards.

#### Weight Formula
```
W = N(N+1)/2
```
Where:
- `W` = Total weight
- `N` = Number of winners

#### Individual Payout Formula
```
P_i = R × (N-i+1) / W
```
Where:
- `P_i` = Payout for position i
- `R` = Pool after house fee
- `i` = Position (1st, 2nd, 3rd...)
- `N` = Total winners
- `W` = Total weight

### Medium-Tier Example

**Scenario**: Medium risk room with 50 winners
- **Entry Fee**: 1 TON per player
- **Players**: 100 participants
- **House Fee**: 2.5% = 2.5 TON
- **Pool After Fee (R)**: 97.5 TON
- **Winners (N)**: 50
- **Total Weight (W)**: 50 × 51 ÷ 2 = 1,275

**Payouts**:
- **1st Place**: 97.5 × 50 ÷ 1,275 ≈ 38.24 TON
- **2nd Place**: 97.5 × 49 ÷ 1,275 ≈ 37.47 TON
- **25th Place**: 97.5 × 26 ÷ 1,275 ≈ 19.88 TON
- **50th Place**: 97.5 × 1 ÷ 1,275 ≈ 0.76 TON

## Contract Architecture

### Core Functions

#### External Message Handlers
- **`open_room(room_id, day, entry_fee, tier)`**: Creates new game room with specified parameters
- **`enter_paid(room_id, day)`**: Allows players to enter paid rooms
- **`close_room(room_id, day)`**: Closes room for new entries
- **`payout_paid(room_id, day, winners, weights)`**: Distributes rewards using linear weights
- **`fund_airdrop()`**: Accepts contributions to airdrop pool
- **`payout_airdrop(top, streak)`**: Distributes airdrop rewards
- **`upgrade(new_code)`**: Contract upgrade mechanism

#### State Management
- **Room State**: Tracks entry fees, winner counts, status, and pools
- **Linear Weights**: Validates payout distribution formulas
- **Access Control**: Admin-only functions for room management
- **Event Emission**: Tracks all major contract interactions

### Security Features
- **Admin Access Control**: Only authorized addresses can manage rooms
- **Mathematical Validation**: Ensures payout weights are mathematically correct
- **Bounce Protection**: Safe message handling for all payouts
- **Upgrade Authority**: Controlled contract upgrades

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm 8+
- TON wallet with testnet coins

### Installation
```bash
# Clone repository
git clone https://github.com/your-org/fae-ton.git
cd fae-ton

# Install dependencies
pnpm install

# Build contracts
pnpm run build:contracts

# Run tests
pnpm test
```

### Environment Setup
Create `.env` file:
```bash
# TON Network Configuration
TREASURY_ADDRESS=EQ...your_treasury_address
NETWORK=testnet
TONCENTER_API_KEY=your_api_key_here

# Wallet Configuration
MNEMONIC="your wallet mnemonic phrase here"
```

### Deployment
```bash
# Deploy to testnet
pnpm run deploy:testnet

# Deploy to mainnet
pnpm run deploy:mainnet
```

## Testing

```bash
# Run all tests
pnpm test

# Run specific test suites
pnpm test:treasury
pnpm test:security
pnpm test:airdrop
```

## Contract Addresses

- **Testnet**: Configure in `.env` file
- **Mainnet**: Deploy using deployment scripts

## Development

### Building Contracts
```bash
pnpm run build:contracts
```

### Running Scripts
```bash
# Open game room
pnpm run open-room --room-id 1 --day 1 --entry-fee 1 --tier 2

# Enter paid room
pnpm run enter-paid --room-id 1 --day 1

# Close room
pnpm run close-room --room-id 1 --day 1

# Payout rewards
pnpm run payout-paid --room-id 1 --day 1 --winners [addresses] --weights [weights]
```

## License

MIT License - see LICENSE file for details 