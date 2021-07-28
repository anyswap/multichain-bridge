// import bridgeList from './data/bridgeList.json'

import {toChainUrl, dislineUrl, Status, chainInfoUrl} from './constants'
import {
  getUrlData,
  getLocalData,
  setLocalData
} from './Tools'

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

const CURRENTCHAIN = 'CURRENTCHAIN'
// GetTokenListByChainID
// GetTokenListByTokenAddr
// GetChainList
export function GetTokenListByChainID ({
  srcChainID,
  destChainID,
  tokenList = []
}: {
  srcChainID:any,
  destChainID?:any,
  tokenList?: Array<string>
}) {
  return new Promise(resolve => {
    // console.log(chainId)
    const lObj = getLocalData(CURRENTCHAIN, srcChainID, CURRENTCHAIN)
    // console.log(lObj)
    if (lObj) {
      resolve(lObj)
    } else {
      getUrlData({url: toChainUrl + '/' + srcChainID}).then((res:any) => {
        if (res && res.msg && res.msg === Status.Error) {
          resolve('')
        } else {
          const data:any = res
          let bsckData:any = {}
          if (destChainID && tokenList.length > 0) {
            for (const key in data) {
              for (const token in data[key]) {
                if (tokenList.length > 0 && !tokenList.includes(token)) continue
                if (!bsckData[key]) bsckData[key] = {}
                bsckData[key][token] = {
                  ...data[key][token],
                  destChains: {
                    [destChainID]: {
                      ...data[key][token].destChains[destChainID]
                    }
                  }
                }
              }
            }
          } else if (!destChainID && tokenList.length > 0) {
            for (const key in data) {
              for (const token in data[key]) {
                if (tokenList.length > 0 && !tokenList.includes(token)) continue
                if (!bsckData[key]) bsckData[key] = {}
                bsckData[key][token] = {
                  ...data[key][token]
                }
              }
            }
          } else if (destChainID && tokenList.length <= 0) {
            for (const key in data) {
              for (const token in data[key]) {
                if (!bsckData[key]) bsckData[key] = {}
                bsckData[key][token] = {
                  ...data[key][token],
                  destChains: {
                    [destChainID]: {
                      ...data[key][token].destChains[destChainID]
                    }
                  }
                }
              }
            }
          } else {
            bsckData = data
          }
          setLocalData(CURRENTCHAIN, srcChainID, CURRENTCHAIN, bsckData)
          resolve(bsckData)
        }
      })
    }
  })
}

/**
 * 获取指定链与链的币种信息，支持跨链和提现（swapin/swapout）
 */
const CHAININFO = 'CHAININFO'
export function GetChainList () {
  return new Promise(resolve => {
    const lObj = getLocalData(CHAININFO, CHAININFO, CHAININFO)
    if (lObj) {
      resolve(lObj)
    } else {
      getUrlData({url: chainInfoUrl}).then((res:any) => {
        // console.log(res)
        if (!res) {
          resolve('')
        } else {
          const data:any = res
          setLocalData(CHAININFO, CHAININFO, CHAININFO, data)
          resolve(data)
        }
      })
    }
  })
}