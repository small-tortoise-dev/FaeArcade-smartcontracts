import { describe, it, expect } from 'vitest'
import { Counter } from '../wrappers/Counter'
import { Address } from 'ton-core'

describe('Counter', () => {
  it('should create counter instance', async () => {
    const owner = Address.parse('EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t')
    const counter = await Counter.fromInit(owner)
    
    expect(counter).toBeDefined()
    expect(counter.address).toBeDefined()
  })

  it('should have correct initial configuration', async () => {
    const owner = Address.parse('EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t')
    const counter = await Counter.fromInit(owner)
    
    expect(counter.init).toBeDefined()
    expect(counter.init?.data).toBeDefined()
  })

  it('should implement Contract interface', () => {
    const owner = Address.parse('EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t')
    const counter = new Counter(owner)
    
    expect(typeof counter.sendDeploy).toBe('function')
    expect(typeof counter.sendIncrement).toBe('function')
    expect(typeof counter.sendDecrement).toBe('function')
  })

  it('should handle address parsing', () => {
    const addressString = 'EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t'
    const address = Address.parse(addressString)
    
    expect(address.toString()).toBe(addressString)
  })
}) 