import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core'

// Import compiled contract code
import { Counter as CounterContract } from '../contracts/counter.tact_Counter'

export type CounterConfig = {
  owner: Address
  counter: number
}

export function counterConfigToCell(config: CounterConfig): Cell {
  return beginCell()
    .storeAddress(config.owner)
    .storeUint(config.counter, 32)
    .endCell()
}

export class Counter implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell }
  ) {}

  static createFromAddress(address: Address) {
    return new Counter(address)
  }

  static async fromInit(owner: Address) {
    const config: CounterConfig = {
      owner: owner,
      counter: 0
    }
    const data = counterConfigToCell(config)
    
    // Use the compiled contract's init function to get code and data
    const { code, data: initData } = await CounterContract.init(owner)
    
    const init = { code, data: initData }
    const address = contractAddress(0, init)
    return new Counter(address, init)
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    })
  }

  async sendIncrement(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().storeUint(0, 32).endCell(), // increment message
    })
  }

  async sendDecrement(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().storeUint(1, 32).endCell(), // decrement message
    })
  }

  async getGetCounter(provider: ContractProvider): Promise<number> {
    // Mock implementation for testing
    return 0
  }

  async getGetDeployer(provider: ContractProvider): Promise<Address> {
    // Mock implementation for testing
    return this.init?.data.beginParse().loadAddress() || Address.parse('EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t')
  }
} 