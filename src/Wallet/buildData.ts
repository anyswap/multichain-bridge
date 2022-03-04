import {ethers} from 'ethers'
import swapBTCABI from '../ABI/swapBTCABI.json'
import swapETHABI from '../ABI/swapETHABI.json'
import {getWeb3Contract, web3Fn} from './web3'
import {getContract as getMMContract, getProvider, getMMBaseInfo} from './metamask'
import {specSymbol, Status, ChainId} from '../constants'
import {
  isAddress
} from '../Tools'
import {recordsTxns} from '../Tools/recordsTxns'
import {GetTokenListByChainID} from '../getBridgeInfo'

interface BuildParams {
  value: string | number,
  address: string,
  token: string | undefined,
  destChain?: ChainId | undefined
  isRecords?: any
}

export function buildSwapoutSpecData ({
  value,
  address,
  token,
  destChain
}:BuildParams) {
  if (!value || value.toString().indexOf('.') !== -1 || isNaN(Number(value))) {
    throw 'Value verification failed!'
  }
  if (!isAddress(address, destChain)) {
    throw 'Address verification failed!'
  }
  if (!web3Fn.utils.isAddress(token)) {
    throw 'Token verification failed!'
  }
  const contract = getWeb3Contract(swapBTCABI, token)
  return contract.methods.Swapout(value, address).encodeABI()
}

export function buildSwapoutErc20Data ({
  value,
  address,
  token
}:BuildParams) {
  if (!value || value.toString().indexOf('.') !== -1 || isNaN(Number(value))) {
    throw 'Value verification failed!'
  }
  if (!web3Fn.utils.isAddress(address)) {
    throw 'Address verification failed!'
  }
  if (!web3Fn.utils.isAddress(token)) {
    throw 'Token verification failed!'
  }
  const contract = getWeb3Contract(swapETHABI, token)
  return contract.methods.Swapout(value, address).encodeABI()
}


export function buildSwapoutData ({
  value,
  address,
  token,
  destChain
}:BuildParams) {
  if (destChain && specSymbol.includes(ChainId[destChain])) {
    return buildSwapoutSpecData({value, address, token, destChain})
  } else {
    return buildSwapoutErc20Data({value, address, token})
  }
}

export function buildSwapinData ({
  value,
  address,
  token
}:BuildParams) {
  if (!value || value.toString().indexOf('.') !== -1 || isNaN(Number(value))) {
    throw 'Value verification failed!'
  }
  if (!web3Fn.utils.isAddress(address)) {
    throw 'Address verification failed!'
  }
  if (!web3Fn.utils.isAddress(token)) {
    throw 'Token verification failed!'
  }
  const contract = getWeb3Contract(swapBTCABI, token)
  return contract.methods.transfer(address, value).encodeABI()
}

export function signSwapoutSpecData ({
  value,
  address,
  token,
  destChain
}:BuildParams) {
  return new Promise(resolve => {
    if (!value || value.toString().indexOf('.') !== -1 || isNaN(Number(value))) {
      resolve({
        msg: Status.Error,
        error: 'Value verification failed!'
      })
      return
    }
    if (!isAddress(address, destChain)) {
      resolve({
        msg: Status.Error,
        error: 'Address verification failed!'
      })
      return
    }
    if (!web3Fn.utils.isAddress(token)) {
      resolve({
        msg: Status.Error,
        error: 'Token verification failed!'
      })
      return
    }
    const contract = getMMContract(swapBTCABI, token)
    contract.Swapout(value, address).then((res:any) => {
      console.log(res)
      resolve({
        msg: Status.Success,
        info: res.hash
      })
    }).catch((err:any) => {
      resolve({
        msg: Status.Error,
        error: err?.data?.message ? err?.data?.message : (err?.message ? err?.message : err.toString())
      })
    })
  })
}

export function signSwapoutErc20Data ({
  value,
  address,
  token
}:BuildParams) {
  return new Promise(resolve => {
    if (!value || value.toString().indexOf('.') !== -1 || isNaN(Number(value))) {
      resolve({
        msg: Status.Error,
        error: 'Value verification failed!'
      })
      return
    }
    if (!web3Fn.utils.isAddress(address)) {
      resolve({
        msg: Status.Error,
        error: 'Address verification failed!'
      })
      return
    }
    if (!web3Fn.utils.isAddress(token)) {
      resolve({
        msg: Status.Error,
        error: 'Token verification failed!'
      })
      return
    }
    const contract = getMMContract(swapETHABI, token)
    contract.Swapout(value, address).then((res:any) => {
      console.log(res)
      resolve({
        msg: Status.Success,
        info: res.hash
      })
    }).catch((err:any) => {
      resolve({
        msg: Status.Error,
        error: err?.data?.message ? err?.data?.message : (err?.message ? err?.message : err.toString())
      })
    })
  })
}

export async function signSwapoutData ({
  value,
  address,
  token,
  destChain,
  isRecords
}:BuildParams) {
  let results:any
  const baseInfo:any = await getMMBaseInfo()
  const tokenList:any = await GetTokenListByChainID({srcChainID: baseInfo.chainId})
  const curTokenInfo = tokenList && token ? tokenList.bridge[token] : ''
  const destTokenInfo = curTokenInfo && destChain ? curTokenInfo.destChains[destChain] : ''
  const rdata = {
    hash: '',
    chainId: destChain,
    selectChain: baseInfo.chainId,
    account: baseInfo.account?.toLowerCase(),
    value: ethers.BigNumber.from(value).toString(),
    formatvalue: '',
    to: address,
    symbol: '',
    version: 'swapout',
    pairid: destTokenInfo.pairid
  }
  // console.log(rdata)
  if (destChain && specSymbol.includes(ChainId[destChain])) {
    results = await signSwapoutSpecData({value, address, token, destChain})
  } else {
    results = await signSwapoutErc20Data({value, address, token})
  }
  if (results.msg === Status.Success && destTokenInfo.pairid && !isRecords) {
    rdata.hash = results.info
    recordsTxns(rdata)
  }
  return results
}

export function signSwapinData ({
  value,
  address,
  token,
  destChain,
  isRecords
}:BuildParams) {
  return new Promise(async(resolve) => {
    console.log(value.toString().indexOf('.') === -1)
    if (!value || value.toString().indexOf('.') !== -1 || isNaN(Number(value))) {
      resolve({
        msg: Status.Error,
        error: 'Value verification failed!'
      })
      return
    }
    if (!web3Fn.utils.isAddress(address)) {
      resolve({
        msg: Status.Error,
        error: 'Address verification failed!'
      })
      return
    }
    if (!token) {
      resolve({
        msg: Status.Error,
        error: 'Token verification failed!'
      })
      return
    }
    // console.log(token)
    const baseInfo:any = await getMMBaseInfo()
    const tokenList:any = await GetTokenListByChainID({srcChainID: baseInfo.chainId})
    const curTokenInfo = tokenList ? tokenList.bridge[token] : ''
    const destTokenInfo = curTokenInfo && destChain ? curTokenInfo.destChains[destChain] : ''
    // console.log(baseInfo)
    // console.log(curTokenInfo)
    // console.log(destTokenInfo)
    const rdata = {
      hash: '',
      chainId: baseInfo.chainId,
      selectChain: destChain,
      account: baseInfo.account?.toLowerCase(),
      value: ethers.BigNumber.from(value).toString(),
      formatvalue: '',
      to: '',
      symbol: '',
      version: 'swapin',
      pairid: destTokenInfo.pairid
    }
    // console.log(rdata)
    if (web3Fn.utils.isAddress(token)) {
      const contract = getMMContract(swapBTCABI, token)
      contract.transfer(address, value).then((res:any) => {
        // console.log(res)
        rdata.hash = res
        if (!isRecords) {
          recordsTxns(rdata)
        }
        resolve({
          msg: Status.Success,
          info: res.hash
        })
      }).catch((err:any) => {
        console.log(err)
        resolve({
          msg: Status.Error,
          error: err?.data?.message ? err?.data?.message : (err?.message ? err?.message : err.toString())
        })
      })
    } else {
      const provider = getProvider({})
      const data = {
        from: baseInfo.account,
        to: address,
        value: value
      }
      // console.log(data)
      provider.send('eth_sendTransaction', [data]).then((res:any) => {
        rdata.hash = res
        if (destTokenInfo.pairid && !isRecords) {
          recordsTxns(rdata)
        }
        resolve({
          msg: Status.Success,
          info: res
        })
      }).catch((err:any) => {
        console.log(err)
        resolve({
          msg: Status.Error,
          error: err?.data?.message ? err?.data?.message : (err?.message ? err?.message : err.toString())
        })
      })
      // provider.send('eth_requestAccounts', []).then((res:any) => {
      //   console.log(res)
      // })
    }
  })
}