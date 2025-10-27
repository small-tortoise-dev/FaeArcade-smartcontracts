// Blueprint configuration for TON smart contracts
export const config = {
  contracts: {
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