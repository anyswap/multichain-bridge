import {toChainUrl, dislineUrl, Status, chainInfoUrl, routerInfoUrl, routerVersion} from './constants'
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
  tokenList = [],
  chainList = [],
  bridgeAPI
}: {
  srcChainID:any,
  tokenList?: Array<string>
  chainList?: Array<string>
  bridgeAPI?: string | undefined
}) {
  return new Promise(resolve => {
    // console.log(bridgeAPI)
    // console.log(srcChainID)
    const lObj = getLocalData(CURRENTCHAIN, srcChainID, CURRENTCHAIN)
    // console.log(lObj)
    if (lObj) {
      resolve(lObj)
    } else {
      getUrlData({url: (bridgeAPI ? bridgeAPI : toChainUrl) + '/' + srcChainID}).then((res:any) => {
        if (res && res.msg && res.msg === Status.Error) {
          resolve('')
        } else {
          const data:any = res
          let bsckData:any = {}
          if (chainList.length > 0 && tokenList.length > 0) {
            for (const key in data) {
              for (const token in data[key]) {
                if (!tokenList.includes(token)) continue
                if (!chainList.includes(data[key][token].chainId)) continue
                if (!bsckData[key]) bsckData[key] = {}
                for (const c in data[key][token].destChains) {
                  if (chainList.includes(c)) {
                    if (!bsckData[key][token]) {
                      bsckData[key][token] = {
                        ...data[key][token],
                        destChains: {}
                      }
                    }
                    bsckData[key][token].destChains[c] = {
                      ...data[key][token].destChains[c]
                    }
                  }
                }
              }
            }
          } else if (chainList.length <= 0 && tokenList.length > 0) {
            for (const key in data) {
              for (const token in data[key]) {
                if (!tokenList.includes(token)) continue
                if (!bsckData[key]) bsckData[key] = {}
                bsckData[key][token] = {
                  ...data[key][token]
                }
              }
            }
          } else if (chainList.length > 0 && tokenList.length <= 0) {
            for (const key in data) {
              for (const token in data[key]) {
                if (!chainList.includes(data[key][token].chainId)) continue
                if (!bsckData[key]) bsckData[key] = {}
                for (const c in data[key][token].destChains) {
                  // console.log(chainList)
                  if (chainList.includes(c)) {
                    if (!bsckData[key][token]) {
                      bsckData[key][token] = {
                        ...data[key][token],
                        destChains: {}
                      }
                    }
                    bsckData[key][token].destChains[c] = {
                      ...data[key][token].destChains[c]
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

const ROUTERTOKENLIST = 'ROUTERTOKENLIST'
export function GetRouterListByChainID ({
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
    if (!srcChainID) {
      resolve('')
    } else {
      const lObj = getLocalData(ROUTERTOKENLIST, srcChainID, ROUTERTOKENLIST)
      if (lObj) {
        resolve(lObj)
      } else {
        if (!srcChainID) {
          resolve('')
        } else {
          getUrlData({url: `${routerInfoUrl}?chainId=${srcChainID}&version=${routerVersion}`}).then((res:any) => {
            if (res && res.msg && res.msg === Status.Error) {
              resolve('')
            } else {
              const data:any = res
              let bsckData:any = {}
              if (destChainID && tokenList.length > 0) {
                for (const token in data) {
                  if (tokenList.length > 0 && !tokenList.includes(token)) continue
                  bsckData[token] = {
                    ...data[token],
                    destChains: {
                      [destChainID]: {
                        ...data[token].destChains[destChainID]
                      }
                    }
                  }
                }
              } else if (!destChainID && tokenList.length > 0) {
                for (const token in data) {
                  if (tokenList.length > 0 && !tokenList.includes(token)) continue
                  bsckData[token] = {
                    ...data[token]
                  }
                }
              } else if (destChainID && tokenList.length <= 0) {
                for (const token in data) {
                  bsckData[token] = {
                    ...data[token],
                    destChains: {
                      [destChainID]: {
                        ...data[token].destChains[destChainID]
                      }
                    }
                  }
                }
              } else {
                bsckData = data
              }
              setLocalData(ROUTERTOKENLIST, srcChainID, ROUTERTOKENLIST, bsckData)
              resolve(bsckData)
            }
          })
        }
      }
    }
  })
}

/**
 * 
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