import { Address, beginCell, Cell, Dictionary, contractAddress } from '@ton/core'
import { Contract, ContractProvider, Sender } from '@ton/core'

// Import compiled contract code and types
import { Treasury as TreasuryContract, Treasury$Data, storeTreasury$Data, RoomData as TreasuryRoomData, dictValueParserRoomData } from '../contracts/Treasury.tact_Treasury'

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
    // MANUAL FIX: Build complete initial state using storeTreasury$Data
    // This bypasses the buggy generated Treasury_init function that adds extra flag bits
    const initialState: Treasury$Data = {
      $$type: 'Treasury$Data',
      owner: owner,
      upgrade_authority: upgradeAuthority,
      airdrop_pool: 0n,
      airdrop_id: 0n,
      rooms: Dictionary.empty<bigint, TreasuryRoomData>(Dictionary.Keys.BigInt(257), dictValueParserRoomData()),
      current_room_id: 0n,
      winner_rewards: Dictionary.empty<Address, bigint>(Dictionary.Keys.Address(), Dictionary.Values.BigInt(257)),
      claimed_rewards: Dictionary.empty<Address, bigint>(Dictionary.Keys.Address(), Dictionary.Values.BigInt(257)),
      HOUSE_FEE_BPS: 250n,
      HOUSE_FEE_DENOMINATOR: 10000n
    }
    
    const data = beginCell().store(storeTreasury$Data(initialState)).endCell()
    
    // Get the contract init from the generated contract
    const generatedInit = await TreasuryContract.init(owner, upgradeAuthority)
    const code = generatedInit.code
    
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
      .storeVarUint(entryFee, 16) // Contract expects varuint16, not coins
      .storeUint(winnersCount, 8)
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
      .storeUint(1380690280, 32) // Opcode for EnterRoom (computed by Tact compiler)
      .storeUint(roomKey, 32)
      .storeVarUint(entryFee, 16) // Contract expects varuint16, not coins
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
      .storeUint(2943936156, 32) // Opcode for CloseRoom (computed by Tact compiler)
      .storeUint(roomKey, 32)
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
      body
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
          winnersCount: Number(slice.loadUint(8)),
          status: Number(slice.loadUint(8)),
          pool: slice.loadCoins(),
          totalEntries: Number(slice.loadUint(32)),
          paidHash: Number(slice.loadUint(32)),
          createdAt: Number(slice.loadUint(32)),
          closedAt: Number(slice.loadUint(32))
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