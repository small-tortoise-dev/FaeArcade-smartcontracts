import { Blueprint } from '@ton/blueprint'

export const config: Blueprint = {
  contracts: {
    Counter: {
      path: '../contracts/counter.tact',
      output: '../contracts',
    },
    Treasury: {
      path: '../contracts/Treasury.tact',
      output: '../contracts',
    },
  },
  networks: {
    mainnet: {
      endpoint: 'https://toncenter.com/api/v2/jsonRPC',
      apiKey: process.env.TONCENTER_API_KEY,
    },
    testnet: {
      endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
      apiKey: process.env.TONCENTER_API_KEY,
    },
  },
} 