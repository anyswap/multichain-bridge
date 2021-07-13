// import bridgeList from './data/bridgeList.json'

import {toChainUrl, dislineUrl, chainToChainUrl, Status} from './constants'
import {
  getUrlData,
  getLocalData,
  setLocalData
} from './Tools'

interface ParamsIntervace {
  srcChainID?: number | string,
  destChainID?: number | string
}

// console.log(bridgeList)
/**
 * 获取即将下线的币种信息，仅支持提现（swapout）
 */
const DISLINEBRIDGE = 'DISLINEBRIDGE'
export function DislineBridgeInfo (chainId:any) {
  return new Promise(resolve => {
    const lObj = getLocalData(DISLINEBRIDGE, chainId, DISLINEBRIDGE)
    if (lObj) {
      resolve(lObj)
    } else {
      getUrlData({url: dislineUrl + '/' + chainId}).then((res:any) => {
        if (res && res.msg && res.msg === Status.Error) {
          resolve('')
        } else {
          const data:any = {}
          // console.log(res)
          for (const key in res) {
            const obj = res[key]
            const isProxy = obj.DestToken.DelegateToken ? 1 : 0
            const token = isProxy ? obj.DestToken.DelegateToken.toLowerCase() : (obj.DestToken.ContractAddress ? obj.DestToken.ContractAddress.toLowerCase() : '')
            data[token] = obj
          }
          setLocalData(DISLINEBRIDGE, chainId, DISLINEBRIDGE, data)
          resolve(data)
        }
      })
    }
  })
}

/**
 * 获取当前链的币种信息，支持跨链和提现（swapin/swapout）
 */
// function formatBridgeInfo (obj:any, chainId:any) {
//   const SrcToken = obj.DestToken
//   const DestToken = obj.SrcToken
//   const srcChainID = obj.destChainID
//   const destChainID = obj.srcChainID
//   if (srcChainID.toString() === chainId.toString()) {
//     return {
//       ...obj,
//       SrcToken: SrcToken,
//       DestToken: DestToken,
//       destChainID: destChainID,
//       srcChainID: srcChainID,
//       decimals: obj.SrcToken.Decimals
//     }
//   } else if (destChainID.toString() === chainId.toString()) {
//     return {
//       ...obj,
//       SrcToken: DestToken,
//       DestToken: SrcToken,
//       destChainID: srcChainID,
//       srcChainID: destChainID,
//       decimals: obj.DestToken.Decimals
//     }
//   }
// }
const CURRENTCHAIN = 'CURRENTCHAIN'
export function CurrentBridgeInfo (chainId:any) {
  return new Promise(resolve => {
    const lObj = getLocalData(CURRENTCHAIN, chainId, CURRENTCHAIN)
    if (lObj && !(Object.getOwnPropertyNames(lObj.swapin).length === 0 && Object.getOwnPropertyNames(lObj.swapout).length === 0)) {
      // console.log('swapin', Object.getOwnPropertyNames(lObj.swapin).length)
      // console.log('swapout', Object.getOwnPropertyNames(lObj.swapout).length)
      resolve(lObj)
    } else {
      getUrlData({url: toChainUrl + '/' + chainId}).then((res:any) => {
        if (res && res.msg && res.msg === Status.Error) {
          resolve('')
        } else {
          const data:any = {
            swapin: {},
            swapout: {},
            deposit: {}
          }
          if (res.swapout && res.swapout.length > 0) {
            for (const obj of res.swapout) {
              const isProxy = obj.DestToken.DelegateToken ? 1 : 0
              const token = isProxy ? obj.DestToken.DelegateToken.toLowerCase() : (obj.DestToken.ContractAddress ? obj.DestToken.ContractAddress.toLowerCase() : '')
              if (!data.swapout[token]) {
                data.swapout[token] = {
                  name: obj.name,
                  symbol: obj.symbol,
                  decimals: obj.DestToken.Decimals,
                  logoUrl: obj.logoUrl,
                  chainId: chainId,
                  address: token,
                  underlying: isProxy ? {
                    address: obj.DestToken.DelegateToken.toLowerCase(),
                    name: obj.name,
                    symbol: obj.symbol,
                    decimals: obj.DestToken.Decimals,
                    isApprove: !obj.DestToken.IsAnyswapAdapter
                  } : false,
                  destChains: {
                    [obj.srcChainID]: {
                      address: obj.SrcToken.ContractAddress ? obj.SrcToken.ContractAddress.toLowerCase() : obj.symbol,
                      name: obj.name,
                      symbol: obj.symbol,
                      decimals: obj.SrcToken.Decimals,
                      BigValueThreshold: obj.DestToken.BigValueThreshold,
                      ContractVersion: obj.DestToken.ContractVersion,
                      MaximumSwap: obj.DestToken.MaximumSwap,
                      MaximumSwapFee: obj.DestToken.MaximumSwapFee,
                      MinimumSwap: obj.DestToken.MinimumSwap,
                      MinimumSwapFee: obj.DestToken.MinimumSwapFee,
                      SwapFeeRatePerMillion: obj.DestToken.SwapFeeRate,
                      swapfeeon: 1
                    }
                  },
                }
                if (isNaN(obj.srcChainID)) {
                  data.deposit[token] = {
                    name: obj.name,
                    symbol: obj.symbol,
                    decimals: obj.DestToken.Decimals,
                    logoUrl: obj.logoUrl,
                    chainId: obj.srcChainID,
                    address: token,
                    underlying: isProxy ? {
                      address: obj.DestToken.DelegateToken.toLowerCase(),
                      name: obj.name,
                      symbol: obj.symbol,
                      decimals: obj.DestToken.Decimals,
                      isApprove: !obj.DestToken.IsAnyswapAdapter
                    } : false,
                    destChains: {
                      [chainId]: {
                        address: token,
                        name: obj.name,
                        symbol: obj.symbol,
                        decimals: obj.SrcToken.Decimals,
                        BigValueThreshold: obj.SrcToken.BigValueThreshold,
                        ContractVersion: obj.SrcToken.ContractVersion,
                        MaximumSwap: obj.SrcToken.MaximumSwap,
                        MaximumSwapFee: obj.SrcToken.MaximumSwapFee,
                        MinimumSwap: obj.SrcToken.MinimumSwap,
                        MinimumSwapFee: obj.SrcToken.MinimumSwapFee,
                        SwapFeeRatePerMillion: obj.SrcToken.SwapFeeRate,
                        swapfeeon: 1
                      }
                    },
                  }
                }
              } else {
                if (obj.destChainID.toString() === chainId.toString()) {
                  data.swapout[token].destChains[obj.srcChainID] = {
                    address: obj.SrcToken.ContractAddress ? obj.SrcToken.ContractAddress.toLowerCase() : obj.symbol,
                    name: obj.name,
                    symbol: obj.symbol,
                    decimals: obj.SrcToken.Decimals,
                    BigValueThreshold: obj.DestToken.BigValueThreshold,
                    ContractVersion: obj.DestToken.ContractVersion,
                    MaximumSwap: obj.DestToken.MaximumSwap,
                    MaximumSwapFee: obj.DestToken.MaximumSwapFee,
                    MinimumSwap: obj.DestToken.MinimumSwap,
                    MinimumSwapFee: obj.DestToken.MinimumSwapFee,
                    SwapFeeRatePerMillion: obj.DestToken.SwapFeeRate,
                    swapfeeon: 1
                  }
                  if (isNaN(obj.srcChainID)) {
                    data.deposit[token].destChains[chainId] = {
                      address: token,
                      name: obj.name,
                      symbol: obj.symbol,
                      decimals: obj.SrcToken.Decimals,
                      BigValueThreshold: obj.SrcToken.BigValueThreshold,
                      ContractVersion: obj.SrcToken.ContractVersion,
                      MaximumSwap: obj.SrcToken.MaximumSwap,
                      MaximumSwapFee: obj.SrcToken.MaximumSwapFee,
                      MinimumSwap: obj.SrcToken.MinimumSwap,
                      MinimumSwapFee: obj.SrcToken.MinimumSwapFee,
                      SwapFeeRatePerMillion: obj.SrcToken.SwapFeeRate,
                      swapfeeon: 1
                    }
                  }
                }
              }
            }
          }
          if (res.swapin && res.swapin.length > 0) {
            for (const obj of res.swapin) {
              const token = obj.SrcToken.ContractAddress ? obj.SrcToken.ContractAddress.toLowerCase() : obj.symbol
              if (!data.swapin[token]) {
                data.swapin[token] = {
                  name: obj.name,
                  symbol: obj.symbol,
                  decimals: obj.SrcToken.Decimals,
                  logoUrl: obj.logoUrl,
                  chainId: chainId,
                  address: token,
                  underlying: false,
                  destChains: {
                    [obj.destChainID]: {
                      address: obj.DestToken.ContractAddress.toLowerCase(),
                      name: obj.name,
                      symbol: obj.symbol,
                      decimals: obj.DestToken.Decimals,
                      BigValueThreshold: obj.SrcToken.BigValueThreshold,
                      ContractVersion: obj.SrcToken.ContractVersion,
                      MaximumSwap: obj.SrcToken.MaximumSwap,
                      MaximumSwapFee: obj.SrcToken.MaximumSwapFee,
                      MinimumSwap: obj.SrcToken.MinimumSwap,
                      MinimumSwapFee: obj.SrcToken.MinimumSwapFee,
                      SwapFeeRatePerMillion: obj.SrcToken.SwapFeeRate,
                      swapfeeon: 1
                    }
                  },
                }
              } else {
                if (obj.srcChainID.toString() === chainId.toString()) {
                  data.swapin[token].destChains[obj.destChainID] = {
                    address: obj.DestToken.ContractAddress.toLowerCase(),
                    name: obj.name,
                    symbol: obj.symbol,
                    decimals: obj.DestToken.Decimals,
                    BigValueThreshold: obj.SrcToken.BigValueThreshold,
                    ContractVersion: obj.SrcToken.ContractVersion,
                    MaximumSwap: obj.SrcToken.MaximumSwap,
                    MaximumSwapFee: obj.SrcToken.MaximumSwapFee,
                    MinimumSwap: obj.SrcToken.MinimumSwap,
                    MinimumSwapFee: obj.SrcToken.MinimumSwapFee,
                    SwapFeeRatePerMillion: obj.SrcToken.SwapFeeRate,
                    swapfeeon: 1
                  }
                }
                // data.swapin[token].destChains.push(formatBridgeInfo(obj, chainId))
              }
            }
          }
          setLocalData(CURRENTCHAIN, chainId, CURRENTCHAIN, data)
          resolve(data)
        }
      })
    }
  })
}

/**
 * 获取指定链与链的币种信息，支持跨链和提现（swapin/swapout）
 */
 const CHAINTOCHAIN = 'CHAINTOCHAIN'
export function ChainToChain ({
  srcChainID,
  destChainID
}: ParamsIntervace) {
  return new Promise(resolve => {
    const lObj = getLocalData(CHAINTOCHAIN, destChainID, CHAINTOCHAIN)
    if (lObj) {
      resolve(lObj)
    } else {
      getUrlData({url: chainToChainUrl, params: {
        srcChainID,
        destChainID
      }}).then((res:any) => {
        // console.log(res)
        if (res && res.msg && res.msg === Status.Error) {
          resolve('')
        } else {
          const data:any = {}
          // console.log(res)
          for (const obj of res) {
            const isProxy = obj.data.DestToken.DelegateToken ? 1 : 0
            const token = isProxy ? obj.data.DestToken.DelegateToken.toLowerCase() : (obj.data.DestToken.ContractAddress ? obj.data.DestToken.ContractAddress.toLowerCase() : '')
            data[token] = {
              ...obj,
              ...obj.data
            }
            delete data[token].data
          }
          setLocalData(CHAINTOCHAIN, destChainID, CHAINTOCHAIN, data)
          resolve(data)
        }
      })
    }
  })
}