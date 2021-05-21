import swapBTCABI from '../ABI/swapBTCABI.json'
import swapETHABI from '../ABI/swapETHABI.json'
import {getContract, web3Fn} from './web3'
import {getContract as getMMContract} from './metamask'
import {specSymbol, Status, ChainId} from '../constants'
import {
  isAddress
} from '../Tools'

interface BuildParams {
  value: string,
  address: string,
  token: string,
  srcChain?: ChainId
}

export function buildSwapoutSpecData ({
  value,
  address,
  token,
  srcChain
}:BuildParams) {
  if (!web3Fn.utils.isHexStrict(value)) {
    throw 'Value verification failed!'
  }
  if (!isAddress(address, srcChain)) {
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
  if (!web3Fn.utils.isHexStrict(value)) {
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
  srcChain
}:BuildParams) {
  if (srcChain && specSymbol.includes(ChainId[srcChain])) {
    return buildSwapoutSpecData({value, address, token, srcChain})
  } else {
    return buildSwapoutErc20Data({value, address, token})
  }
}

export function buildSwapinData ({
  value,
  address,
  token
}:BuildParams) {
  if (!web3Fn.utils.isHexStrict(value)) {
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
  srcChain
}:BuildParams) {
  if (!web3Fn.utils.isHexStrict(value)) {
    throw 'Value verification failed!'
  }
  if (!isAddress(address, srcChain)) {
    throw 'Address verification failed!'
  }
  if (!web3Fn.utils.isAddress(token)) {
    throw 'Token verification failed!'
  }
  return new Promise(resolve => {
    const contract = getMMContract(swapBTCABI, token)
    contract.Swapout(value, address).then((res:any) => {
      console.log(res)
      resolve({
        msg: Status.Success,
        info: res
      })
    }).catch((err:any) => {
      resolve({
        msg: Status.Error,
        error: err.toString()
      })
    })
  })
}

export function signSwapoutErc20Data ({
  value,
  address,
  token
}:BuildParams) {
  if (!web3Fn.utils.isHexStrict(value)) {
    throw 'Value verification failed!'
  }
  if (!web3Fn.utils.isAddress(address)) {
    throw 'Address verification failed!'
  }
  if (!web3Fn.utils.isAddress(token)) {
    throw 'Token verification failed!'
  }
  return new Promise(resolve => {
    const contract = getMMContract(swapETHABI, token)
    contract.Swapout(value, address).then((res:any) => {
      console.log(res)
      resolve({
        msg: Status.Success,
        info: res
      })
    }).catch((err:any) => {
      resolve({
        msg: Status.Error,
        error: err.toString()
      })
    })
  })
}

export function signSwapoutData ({
  value,
  address,
  token,
  srcChain
}:BuildParams) {
  if (srcChain && specSymbol.includes(ChainId[srcChain])) {
    return signSwapoutSpecData({value, address, token, srcChain})
  } else {
    return signSwapoutErc20Data({value, address, token})
  }
}

export function signSwapinData ({
  value,
  address,
  token
}:BuildParams) {
  if (!web3Fn.utils.isHexStrict(value)) {
    throw 'Value verification failed!'
  }
  if (!web3Fn.utils.isAddress(address)) {
    throw 'Address verification failed!'
  }
  if (!web3Fn.utils.isAddress(token)) {
    throw 'Token verification failed!'
  }
  return new Promise(resolve => {
    const contract = getMMContract(swapBTCABI, token)
    contract.transfer(address, value).then((res:any) => {
      console.log(res)
      resolve({
        msg: Status.Success,
        info: res
      })
    }).catch((err:any) => {
      resolve({
        msg: Status.Error,
        error: err.toString()
      })
    })
  })
}