import { Address, beginCell, Cell, toNano, StateInit } from '@ton/core'
import { Contract, ContractProvider, Sender } from '@ton/core'

// Import compiled contract code
import { Treasury as TreasuryContract } from '../contracts/Treasury.tact_Treasury'

export type TreasuryConfig = {
  owner: Address
  upgradeAuthority: Address
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
      .storeUint(0, 32) // op code
      .storeUint(roomKey, 32)
      .storeCoins(entryFee)
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
    entryFee: bigint
  ) {
    await provider.internal(via, {
      value: entryFee,
      body: beginCell().storeUint(0, 32).storeStringTail('enter_paid').endCell()
    })
  }

  async sendCloseRoom(
    provider: ContractProvider,
    via: Sender,
    value: bigint = toNano('0.1')
  ) {
    await provider.internal(via, {
      value,
      body: beginCell().storeUint(0, 32).storeStringTail('close_room').endCell()
    })
  }

  async sendPayoutPaid(
    provider: ContractProvider,
    via: Sender,
    value: bigint,
    winners: Array<{ address: Address; weight: number }>
  ) {
    const body = beginCell()
      .storeUint(0, 32) // op code
      .storeUint(winners.length, 8)

    // Add winner addresses
    for (const winner of winners) {
      body.storeAddress(winner.address)
    }

    await provider.internal(via, {
      value,
      body: body.endCell()
    })
  }

  async sendFundAirdrop(
    provider: ContractProvider,
    via: Sender,
    amount: bigint
  ) {
    await provider.internal(via, {
      value: amount,
      body: beginCell().storeUint(0, 32).storeStringTail('fund_airdrop').endCell()
    })
  }

  async sendPayoutAirdrop(
    provider: ContractProvider,
    via: Sender,
    value: bigint,
    topScorerWinners: Address[],
    streakWinners: Address[]
  ) {
    const body = beginCell()
      .storeUint(0, 32) // op code
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

  async getCurrentRoomEntryFee(provider: ContractProvider): Promise<bigint> {
    const result = await provider.get('getCurrentRoomEntryFee', [])
    return result.stack.readBigNumber()
  }

  async getCurrentRoomStatus(provider: ContractProvider): Promise<number> {
    const result = await provider.get('getCurrentRoomStatus', [])
    return result.stack.readNumber()
  }

  async getCurrentRoomPool(provider: ContractProvider): Promise<bigint> {
    const result = await provider.get('getCurrentRoomPool', [])
    return result.stack.readBigNumber()
  }

  async getHouseFeeBps(provider: ContractProvider): Promise<number> {
    const result = await provider.get('getHouseFeeBps', [])
    return result.stack.readNumber()
  }
} 