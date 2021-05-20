// import bridgeList from './data/bridgeList.json'

import {toChainUrl, dislineUrl, chainToChainUrl} from './constants'
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
        if (res && res.msg && res.msg === 'Error') {
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
const CURRENTCHAIN = 'CURRENTCHAIN'
export function CurrentBridgeInfo (chainId:any) {
  return new Promise(resolve => {
    const lObj = getLocalData(CURRENTCHAIN, chainId, CURRENTCHAIN)
    if (lObj) {
      resolve(lObj)
    } else {
      getUrlData({url: toChainUrl + '/' + chainId}).then((res:any) => {
        if (res && res.msg && res.msg === 'Error') {
          resolve('')
        } else {
          const data:any = {}
          for (const key in res) {
            data[key] = {}
            for (const obj of res[key]) {
              const isProxy = obj.DestToken.DelegateToken ? 1 : 0
              const token = isProxy ? obj.DestToken.DelegateToken.toLowerCase() : (obj.DestToken.ContractAddress ? obj.DestToken.ContractAddress.toLowerCase() : '')
              data[key][token] = obj
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
        if (res && res.msg && res.msg === 'Error') {
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