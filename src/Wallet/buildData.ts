import swapBTCABI from '../ABI/swapBTCABI.json'
import swapETHABI from '../ABI/swapETHABI.json'
import {getContract, web3Fn} from './web3'
import {getContract as getMMContract} from './metamask'
import {
  isAddress as isSpecAddress
} from '../SpecialCoin'

export function buildSwapoutSpecData (value:string | number, address: string, token: string, coin: string) {
  if (!web3Fn.utils.isHexStrict(value)) {
    throw 'Value verification failed!'
  }
  if (!isSpecAddress(address, coin)) {
    throw 'Address verification failed!'
  }
  if (!web3Fn.utils.isAddress(token)) {
    throw 'Token verification failed!'
  }
  const contract = getContract(swapBTCABI, token)
  return contract.methods.Swapout(value, address).encodeABI()
}

export function buildSwapoutErc20Data (value:string | number, address: string, token: string) {
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

export function buildSwapinData (value:string | number, address: string, token: string) {
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

export function signSwapoutSpecData (value:string, address: string, token: string, coin: string) {
  if (!web3Fn.utils.isHexStrict(value)) {
    throw 'Value verification failed!'
  }
  if (!isSpecAddress(address, coin)) {
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
        msg: 'Success',
        info: res
      })
    }).catch((err:any) => {
      resolve({
        msg: 'Error',
        info: err.toString()
      })
    })
  })
}

export function signSwapoutErc20Data (value:string | number, address: string, token: string) {
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
        msg: 'Success',
        info: res
      })
    }).catch((err:any) => {
      resolve({
        msg: 'Error',
        info: err.toString()
      })
    })
  })
}

export function signSwapinData (value:string | number, address: string, token: string) {
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
        msg: 'Success',
        info: res
      })
    }).catch((err:any) => {
      resolve({
        msg: 'Error',
        info: err.toString()
      })
    })
  })
}