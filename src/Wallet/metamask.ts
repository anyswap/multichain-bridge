import {ethers} from 'ethers'
import {networks, ChainId} from '../constants'


export function getProvider (chainId?:ChainId) {
  if (window && window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum)
  } else {
    return new ethers.providers.JsonRpcProvider(chainId ? networks[chainId] : '')
  }
}

export function getContract (Abi:any, daiAddress?:string, chainId?:ChainId) {
  const provider = getProvider(chainId)
  // console.log(provider.getBlockNumber())
  console.log(provider.getSigner('0xC03033d8b833fF7ca08BF2A58C9BC9d711257249'))
  const signer = provider.getSigner()
  const contract = new ethers.Contract(daiAddress ? daiAddress : '', Abi, provider).connect(signer)
  return contract
}