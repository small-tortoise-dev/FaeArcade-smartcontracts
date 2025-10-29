import { Address, beginCell, Cell, Dictionary, contractAddress } from '@ton/core'
import { Contract, ContractProvider, Sender } from '@ton/core'

// Import compiled contract code and types
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
    readonly init?: { code: Cell, data: Cell }
  ) {}

  static createFromAddress(address: Address) {
    return new Treasury(address)
  }

  static async fromInit(owner: Address, upgradeAuthority: Address) {
    // Use TreasuryContract.init() for both code AND data
    // This ensures address hash matches and storage layout is correct
    const generatedInit = await TreasuryContract.init(owner, upgradeAuthority)
    const code = generatedInit.code
    const data = generatedInit.data  // Use generated data, not custom
    
    // Calculate address from code + data
    const address = contractAddress(0, { code, data })
    
    return new Treasury(address, { code, data })
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
      .storeUint(2616294104, 32) // Opcode for OpenRoom (computed by Tact compiler)
      .storeUint(roomKey, 32)
      .storeCoins(entryFee) // storeCoins() = VarUInteger 16 format (correct!)
      .storeUint(winnersCount, 8)
      .endCell()

    await provider.internal(via, {
      value,
      body,
      bounce: true
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
      .storeUint(1380690280, 32) // Opcode for EnterRoom (computed by Tact compiler)
      .storeUint(roomKey, 32)
      .storeCoins(entryFee) // storeCoins() = VarUInteger 16 format (correct!)
      .endCell()

    await provider.internal(via, {
      value,
      body,
      bounce: true
    })
  }

  async sendCloseRoom(
    provider: ContractProvider,
    via: Sender,
    value: bigint,
    roomKey: number
  ) {
    const body = beginCell()
      .storeUint(2943936156, 32) // Opcode for CloseRoom (computed by Tact compiler)
      .storeUint(roomKey, 32)
      .endCell()

    await provider.internal(via, {
      value,
      body,
      bounce: true
    })
  }

  async sendDistributePayouts(
    provider: ContractProvider,
    via: Sender,
    value: bigint,
    roomKey: number,
    winners: Array<{ address: Address; weight: number }>
  ) {
    // Build winners dictionary
    const winnersDict = Dictionary.empty<bigint, Address>(Dictionary.Keys.BigInt(257), Dictionary.Values.Address())
    for (let i = 0; i < winners.length; i++) {
      winnersDict.set(BigInt(i), winners[i].address)
    }

    const body = beginCell()
      .storeUint(3561099507, 32) // Opcode for DistributePayouts (computed by Tact compiler)
      .storeUint(roomKey, 32)
      .storeUint(winners.length, 8)
      .storeDict(winnersDict)
      .endCell()

    await provider.internal(via, {
      value,
      body,
      bounce: true
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
      .storeUint(3468397897, 32) // Opcode for ClaimReward (computed by Tact compiler)
      .storeUint(roomKey, 32)
      .storeAddress(winnerAddress)
      .endCell()

    await provider.internal(via, {
      value,
      body,
      bounce: true
    })
  }

  async sendFundAirdrop(
    provider: ContractProvider,
    via: Sender,
    amount: bigint
  ) {
    // String-based receiver expects text comment
    await provider.internal(via, {
      value: amount,
      body: beginCell()
        .storeUint(0, 32)  // Text comment prefix
        .storeStringTail("fund_airdrop")  // The string the receiver matches
        .endCell(),
      bounce: true
    })
  }

  async sendDistributeAirdrop(
    provider: ContractProvider,
    via: Sender,
    value: bigint,
    _airdropId: number,
    _topScorerWinners: Address[],
    _streakWinners: Address[]
  ) {
    // String-based receiver expects text comment
    await provider.internal(via, {
      value,
      body: beginCell()
        .storeUint(0, 32)  // Text comment prefix
        .storeStringTail("distribute_airdrop")  // The string the receiver matches
        .endCell(),
      bounce: true
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
      
      // Check if getter returned null
      if (result.stack.remaining === 0) {
        return null
      }
      
      // Tact getters return tuples, not cells
      const roomDataTuple = result.stack.readTuple()
      
      if (!roomDataTuple || roomDataTuple.remaining === 0) {
        return null
      }
      
      return {
        entryFee: roomDataTuple.readBigNumber(),
        winnersCount: roomDataTuple.readNumber(),
        status: roomDataTuple.readNumber(),
        pool: roomDataTuple.readBigNumber(),
        totalEntries: roomDataTuple.readNumber(),
        paidHash: roomDataTuple.readNumber(),
        createdAt: roomDataTuple.readNumber(),
        closedAt: roomDataTuple.readNumber()
      }
    } catch {
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
    } catch {
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
    } catch {
      return null
    }
  }
} 