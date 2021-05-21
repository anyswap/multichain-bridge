export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

// export const baseURL = 'https://bridgeapi.anyswap.exchange'
export const baseURL = 'http://localhost:8107'

export const chainToChainUrl = baseURL + '/v2/allserverinfo'
export const toChainUrl = baseURL + '/v2/bridgeChain'
export const dislineUrl = baseURL + '/v2/disline'
export const swapinStatusUrl = baseURL + '/v2/getHashStatus'
export const swapoutStatusUrl = baseURL + '/v2/getWithdrawHashStatus'

export const timeout = 1000 * 60 * 10

export const LOCAL_DATA_LABEL = 'ANYSWAP-BRIDGE-SDK-V1-'

export enum ChainId {
  MAINNET = 1,
  RINKEBY = 4,
  HTTEST = 256,
  HTMAIN = 128,
  BNBMAIN = 56,
  BNBTEST = 97,
  MATICMAIN = 137,
  XDAIMAIN = 100,
  FTMMAIN = 250,
}

export enum Status {
  Success = 'Success',
  Pending = 'Pending',
  Error = 'Error',
  Failure = 'Failure',
  Confirming = 'Confirming',
  Minting = 'Minting',
  Timeout = 'Timeout',
}
console.log(Status)
export const networks = {
  [ChainId.MAINNET]: 'https://ethmainnet.anyswap.exchange',
  [ChainId.RINKEBY]: 'https://rinkeby.infura.io/v3/0e40cfd5e7a64b2d9aea8427e4bd52a0',
  [ChainId.HTTEST]: 'https://http-testnet.hecochain.com',
  [ChainId.HTMAIN]: 'https://http-mainnet.hecochain.com',
  [ChainId.BNBMAIN]: 'https://bsc-dataseed1.ninicoin.io/',
  [ChainId.BNBTEST]: 'https://data-seed-prebsc-1-s1.binance.org:8545',
  [ChainId.MATICMAIN]: 'https://rpc-mainnet.maticvigil.com',
  [ChainId.XDAIMAIN]: 'https://rpc.xdaichain.com',
  [ChainId.FTMMAIN]: 'https://rpcapi.fantom.network'
}
