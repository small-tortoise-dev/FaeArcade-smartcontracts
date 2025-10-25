import { Address, beginCell, Cell, toNano, StateInit } from '@ton/core'
import { Contract, ContractProvider, Sender } from '@ton/core'

// Import compiled contract code
import { Treasury as TreasuryContract } from '../contracts/Treasury.tact_Treasury'

export type TreasuryConfig = {
  owner: Address
  upgradeAuthority: Address
}

export interface RoomData {
  entryFee: bigint
  winnersCount: number
  status: number // 0=Closed, 1=Open, 2=Paid
  pool: bigint
  totalEntries: number
  paidHash: number
  createdAt: number
  closedAt: number
}

export function treasuryConfigToCell(config: TreasuryConfig): Cell {
  return beginCell()
    .storeAddress(config.owner)
    .storeAddress(config.upgradeAuthority)
    .endCell()
}

export class Treasury implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: StateInit
  ) {}

  static createFromAddress(address: Address) {
    return new Treasury(address)
  }

  static async fromInit(owner: Address, upgradeAuthority: Address) {
    // Use the generated contract's fromInit method which handles everything
    const generatedContract = await TreasuryContract.fromInit(owner, upgradeAuthority)
    
    // Wrap it in our wrapper class
    return new Treasury(generatedContract.address, generatedContract.init)
  }

  async sendOpenRoom(
    provider: ContractProvider,
    via: Sender,
    value: bigint,
    roomKey: number,
    entryFee: bigint,
    winnersCount: number
  ) {
    const body = beginCell()
      .storeUint(0, 32) // op code for text message
      .storeStringTail("open_room_params") // text message (matches contract handler)
      .storeUint(roomKey, 32) // room key
      .storeCoins(entryFee) // entry fee
      .storeUint(winnersCount, 8) // winners count
      .endCell()

    await provider.internal(via, {
      value,
      body
    })
  }

  async sendEnterPaid(
    provider: ContractProvider,
    via: Sender,
    value: bigint,
    roomKey: number,
    entryFee: bigint
  ) {
    const body = beginCell()
      .storeUint(0, 32) // op code for text message
      .storeStringTail("enter_room_params") // text message (matches contract handler)
      .storeUint(roomKey, 32) // room key
      .storeCoins(entryFee) // entry fee
      .endCell()

    await provider.internal(via, {
      value,
      body
    })
  }

  async sendCloseRoom(
    provider: ContractProvider,
    via: Sender,
    value: bigint,
    roomKey: number
  ) {
    const body = beginCell()
      .storeUint(0, 32) // op code for text message
      .storeStringTail("close_room_params") // text message (matches contract handler)
      .storeUint(roomKey, 32) // room key
      .endCell()

    await provider.internal(via, {
      value,
      body
    })
  }

  async sendDistributePayouts(
    provider: ContractProvider,
    via: Sender,
    value: bigint,
    roomKey: number,
    winners: Array<{ address: Address; weight: number }>
  ) {
    const body = beginCell()
      .storeUint(0, 32) // op code for text message
      .storeStringTail("distribute_payouts_params") // text message (matches contract handler)
      .storeUint(roomKey, 32) // room key
      .storeUint(winners.length, 8); // winners count

    // Add winner addresses and weights
    for (const winner of winners) {
      body.storeAddress(winner.address);
      body.storeUint(winner.weight, 8);
    }

    await provider.internal(via, {
      value,
      body: body.endCell()
    })
  }

  async sendClaimReward(
    provider: ContractProvider,
    via: Sender,
    value: bigint,
    roomKey: number,
    winnerAddress: Address
  ) {
    const body = beginCell()
      .storeUint(0, 32) // op code for text message
      .storeStringTail("claim_reward_params") // text message (matches contract handler)
      .storeUint(roomKey, 32) // room key
      .storeAddress(winnerAddress) // winner address
      .endCell()

    await provider.internal(via, {
      value,
      body
    })
  }

  async sendFundAirdrop(
    provider: ContractProvider,
    via: Sender,
    amount: bigint
  ) {
    await provider.internal(via, {
      value: amount,
      body: beginCell().storeUint(0, 32).endCell()
    })
  }

  async sendDistributeAirdrop(
    provider: ContractProvider,
    via: Sender,
    value: bigint,
    airdropId: number,
    topScorerWinners: Address[],
    streakWinners: Address[]
  ) {
    const body = beginCell()
      .storeUint(0, 32) // op code
      .storeUint(airdropId, 32)
      .storeUint(topScorerWinners.length, 8)
      .storeUint(streakWinners.length, 8)

    // Add top scorer addresses
    for (const address of topScorerWinners) {
      body.storeAddress(address)
    }

    // Add streak winner addresses
    for (const address of streakWinners) {
      body.storeAddress(address)
    }

    await provider.internal(via, {
      value,
      body: body.endCell()
    })
  }

  // Getter methods
  async getOwner(provider: ContractProvider): Promise<Address> {
    const result = await provider.get('getOwner', [])
    return result.stack.readAddress()
  }

  async getUpgradeAuthority(provider: ContractProvider): Promise<Address> {
    const result = await provider.get('getUpgradeAuthority', [])
    return result.stack.readAddress()
  }

  async getAirdropPool(provider: ContractProvider): Promise<bigint> {
    const result = await provider.get('getAirdropPool', [])
    return result.stack.readBigNumber()
  }

  async getAirdropId(provider: ContractProvider): Promise<number> {
    const result = await provider.get('getAirdropId', [])
    return result.stack.readNumber()
  }

  async getCurrentRoomId(provider: ContractProvider): Promise<number> {
    const result = await provider.get('getCurrentRoomId', [])
    return result.stack.readNumber()
  }

  async getHouseFeeBps(provider: ContractProvider): Promise<number> {
    const result = await provider.get('getHouseFeeBps', [])
    return result.stack.readNumber()
  }

  async getHouseFeeDenominator(provider: ContractProvider): Promise<number> {
    const result = await provider.get('getHouseFeeDenominator', [])
    return result.stack.readNumber()
  }

  async getRoomData(provider: ContractProvider, roomKey: number): Promise<RoomData | null> {
    try {
      const result = await provider.get('getRoomData', [{ type: 'int', value: BigInt(roomKey) }])
      const roomData = result.stack.readCell()
      
      if (roomData) {
        const slice = roomData.beginParse()
        return {
          entryFee: slice.loadCoins(),
          winnersCount: slice.loadUint(8),
          status: slice.loadUint(8),
          pool: slice.loadCoins(),
          totalEntries: slice.loadUint(32),
          paidHash: slice.loadUint(32),
          createdAt: slice.loadUint(32),
          closedAt: slice.loadUint(32)
        }
      }
      return null
    } catch (error) {
      return null
    }
  }

  async getWinnerReward(provider: ContractProvider, roomKey: number, winnerAddress: Address): Promise<bigint | null> {
    try {
      const result = await provider.get('getWinnerReward', [
        { type: 'int', value: BigInt(roomKey) },
        { type: 'slice', cell: beginCell().storeAddress(winnerAddress).endCell() }
      ])
      return result.stack.readBigNumber()
    } catch (error) {
      return null
    }
  }

  async getClaimedReward(provider: ContractProvider, roomKey: number, winnerAddress: Address): Promise<bigint | null> {
    try {
      const result = await provider.get('getClaimedReward', [
        { type: 'int', value: BigInt(roomKey) },
        { type: 'slice', cell: beginCell().storeAddress(winnerAddress).endCell() }
      ])
      return result.stack.readBigNumber()
    } catch (error) {
      return null
    }
  }
} 