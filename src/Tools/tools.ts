import {
  timeout,
  LOCAL_DATA_LABEL,
  ChainId,
  specSymbol
} from '../constants'
import {isSpecAddress, isTRXAddress, isTERRAAddress} from '../SpecialCoin'
import {web3Fn} from '../Wallet'

export function thousandBit (num:any, dec:any = 8) {
  if (!Number(num)) return '0.00'
    if (Number(num) < 0.00000001) return '<0.00000001'
    if (Number(num) < 0.01) return Number(Number(num).toFixed(6))
    if (Number(num) < 1) return Number(Number(num).toFixed(4))
    if (Number(num) < 1000) {
      if (isNaN(dec)) {
        return num
      } else {
        return Number(num).toFixed(dec)
      }
    }
    const _num = num = Number(num)
    if (isNaN(num)) {
      num = 0
      num = num.toFixed(dec)
    } else {
      if (isNaN(dec)) {
        if (num.toString().indexOf('.') === -1) {
          num = Number(num).toLocaleString()
        } else {
          const numSplit = num.toString().split('.')
          numSplit[1] = numSplit[1].length > 9 ? numSplit[1].substr(0, 8) : numSplit[1]
          num = Number(numSplit[0]).toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toLocaleString()
          num = num.toString().split('.')[0] + '.' + numSplit[1]
        }
      } else {
        num = num.toFixed(dec).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toLocaleString()
      }
    }
    if (_num < 0 && num.toString().indexOf('-') < 0) {
      num = '-' + num
    }
    return num
}

export function formatWeb3Str (str:string, len = 64) {
  // console.log(str)
  str = str.indexOf('0x') === 0 ? str.substr(2) : str
  const strLen = str.length / len
  const arr = []
  for (let i = 0; i < strLen; i++) {
    const str1 = str.substr(i * len, len)
    arr.push('0x' + str1)
  }
  return arr
}

export function formatDecimal(num:any, decimal:number) {
  if (isNaN(num)) {
    return num
  }
  // num = (num * 10000).toFixed(decimal) / 10000
  num = num.toString()
  const index = num.indexOf('.')
  if (index !== -1) {
      num = num.substring(0, decimal + index + 1)
  } else {
      num = num.substring(0)
  }
  return Number(parseFloat(num).toFixed(decimal))
}

function useLocalDB (type?:any) {
  if (window) {
    if (window.localStorage && window.sessionStorage) {
      const lsDB = type ? window.localStorage : window.sessionStorage
      return lsDB
    } else if (window.localStorage && !window.sessionStorage) {
      return window.localStorage
    } else if (!window.localStorage && window.sessionStorage) {
      return window.sessionStorage
    } else {
      return false
    }
  } else {
    return false
  }
}

export function getLocalData (account:string, chainId:any, token:string, dbType?:any) {
  const lsDB = useLocalDB(dbType)
  if (lsDB) {
    const localStr = lsDB.getItem(LOCAL_DATA_LABEL + token)
    if (localStr) {
      const localData = JSON.parse(localStr)
      // console.log(localData)
      // console.log(LOCAL_DATA_LABEL + token)
      if (!localData[chainId]) {
        // console.log(1)
        return false
      } else if (!localData[chainId][account]) {
        // console.log(2)
        return false
      } else if ( ((Date.now() - localData[chainId][account].timestamp) > timeout)) {
        // console.log(3)
        return false
      } else {
        // console.log(4)
        return localData[chainId][account].data
      }
    } else {
      return false
    }
  } else {
    return false
  }
}

export function setLocalData (account:string, chainId:any, token:string, data:any, dbType?:any) {
  const lsDB = useLocalDB(dbType)
  if (lsDB) {
    let lObj:any = {}
    const lstr = lsDB.getItem(LOCAL_DATA_LABEL + token)
    if (!lstr) {
      lObj[chainId] = {}
      lObj[chainId][account] = {}
      lObj[chainId][account] = {
        data: data,
        timestamp: Date.now()
      }
    } else {
      lObj = JSON.parse(lstr)
      // console.log(lObj)
      if (!lObj[chainId]) {
        lObj[chainId] = {}
        lObj[chainId][account] = {
          data: data,
          timestamp: Date.now()
        }
      } else {
        lObj[chainId][account] = {
          data: data,
          timestamp: Date.now()
        }
      }
    }
    lsDB.setItem(LOCAL_DATA_LABEL + token, JSON.stringify(lObj))
  }
}

export function formatSymbol (symbol?:string) {
  if (!symbol) return ''
  symbol = symbol.replace('any', '')
  symbol = symbol.indexOf('a') === 0 ? symbol.substr(1) : symbol
  return symbol.toUpperCase()
}

export function isAddress(address: string, chainId?: any) {
  if (chainId && ChainId[chainId] === ChainId.TRX) {
    return isTRXAddress(address)
  } else if (chainId && ChainId[chainId] === ChainId.TERRA) {
    return isTERRAAddress(address)
  }else if (chainId && specSymbol.includes(ChainId[chainId])) {
    return isSpecAddress(address, ChainId[chainId])
  } else {
    return web3Fn.utils.isAddress(address)
  }
}