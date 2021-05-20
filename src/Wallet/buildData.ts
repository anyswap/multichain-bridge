import swapBTCABI from '../ABI/swapBTCABI.json'
import swapETHABI from '../ABI/swapETHABI.json'
import {getContract} from './web3'
import {getContract as getMMContract} from './metamask'

export function buildSwapoutSpecData (value:string | number, address: string, token: string) {
  const contract = getContract(swapBTCABI, token)
  return contract.methods.Swapout(value, address).encodeABI()
}

export function buildSwapoutErc20Data (value:string | number, address: string, token: string) {
  const contract = getContract(swapETHABI, token)
  return contract.methods.Swapout(value, address).encodeABI()
}

export function buildSwapinData (value:string | number, address: string, token: string) {
  const contract = getContract(swapBTCABI, token)
  return contract.methods.transfer(address, value).encodeABI()
}

export function signSwapoutSpecData (value:string | number, address: string, token: string) {
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