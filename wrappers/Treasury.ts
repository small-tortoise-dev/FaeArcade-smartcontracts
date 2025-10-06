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
    const config: TreasuryConfig = {
      owner: owner,
      upgradeAuthority: upgradeAuthority
    }
    const data = treasuryConfigToCell(config)
    
    // Use the compiled contract's init function to get code and data
    const { code, data: initData } = await TreasuryContract.init(owner, upgradeAuthority)
    
    const init: StateInit = { code, data: initData }
    return new Treasury(owner, init)
  }

  async sendOpenRoom(
    provider: ContractProvider,
    via: Sender,
    value: bigint = toNano('0.1')
  ) {
    await provider.internal(via, {
      value,
      body: beginCell().storeUint(0, 32).storeStringTail('open_room').endCell()
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
    value: bigint = toNano('0.1')
  ) {
    await provider.internal(via, {
      value,
      body: beginCell().storeUint(0, 32).storeStringTail('payout_paid').endCell()
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
    value: bigint = toNano('0.1')
  ) {
    await provider.internal(via, {
      value,
      body: beginCell().storeUint(0, 32).storeStringTail('payout_airdrop').endCell()
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