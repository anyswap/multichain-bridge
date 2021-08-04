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
  const signer = provider.getSigner()
  const contract = new ethers.Contract(daiAddress ? daiAddress : '', Abi, provider).connect(signer)
  return contract
}

export async function getMMBaseInfo (chainId?:any) {
  const provider = getProvider(chainId)
  const account = await provider.send('eth_requestAccounts', [])
  const chainID = await provider.send('eth_chainId', [])
  // console.log(ethers.BigNumber.from(chainID))
  // console.log(ethers.BigNumber.from(chainID).toString())
  // console.log(ethers.BigNumber.from(chainID).toNumber())
  return {
    chainId: ethers.BigNumber.from(chainID).toString(),
    account: account[0]?.toLowerCase()
  }
}