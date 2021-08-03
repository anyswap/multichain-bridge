import swapBTCABI from '../ABI/swapBTCABI.json'
import swapETHABI from '../ABI/swapETHABI.json'
import {getContract, web3Fn} from './web3'
import {getContract as getMMContract, getProvider} from './metamask'
import {specSymbol, Status, ChainId} from '../constants'
import {
  isAddress
} from '../Tools'

interface BuildParams {
  value: string | number,
  address: string,
  token: string | undefined,
  destChain?: ChainId | undefined
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
  const contract = getContract(swapBTCABI, token)
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
  const contract = getContract(swapETHABI, token)
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
  const contract = getContract(swapBTCABI, token)
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

export function signSwapoutData ({
  value,
  address,
  token,
  destChain
}:BuildParams) {
  if (destChain && specSymbol.includes(ChainId[destChain])) {
    return signSwapoutSpecData({value, address, token, destChain})
  } else {
    return signSwapoutErc20Data({value, address, token})
  }
}
// const provider = getProvider()
// provider.send('eth_requestAccounts', []).then(res => {
//   console.log(res)
// })

export function signSwapinData ({
  value,
  address,
  token
}:BuildParams) {
  return new Promise(resolve => {
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
    console.log(token)
    if (web3Fn.utils.isAddress(token)) {
      const contract = getMMContract(swapBTCABI, token)
      contract.transfer(address, value).then((res:any) => {
        // console.log(res)
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
      const provider = getProvider()
      provider.send('eth_requestAccounts', []).then(res => {
        console.log(res)
        const data = {
          from: res[0],
          to: address,
          value: value
        }
        console.log(data)
        provider.send('eth_sendTransaction', [data]).then((res:any) => {
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
      })
    }
  })
}