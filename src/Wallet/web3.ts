const Web3Fn = require('web3')
export const web3Fn = new Web3Fn(new Web3Fn.providers.HttpProvider())

export function getWeb3Contract(ABI:any, ContractAddress?:string) {
  return new web3Fn.eth.Contract(ABI, ContractAddress)
}