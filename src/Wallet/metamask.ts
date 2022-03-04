import {ethers} from 'ethers'
import {networks} from '../constants'


export function getProvider ({chainId, rpc}: {chainId?:any,rpc?:any}) {
  if (window && window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum)
  } else {
    console.log(ethers)
    return new ethers.providers.JsonRpcProvider(rpc ? rpc : (chainId ? networks[chainId] : ''))
  }
}

export function getContract (Abi:any, daiAddress?:string, chainId?:any) {
  const provider = getProvider({chainId})
  const signer = provider.getSigner()
  const contract = new ethers.Contract(daiAddress ? daiAddress : '', Abi, provider).connect(signer)
  return contract
}

export async function getMMBaseInfo (chainId?:any) {
  const provider = getProvider({chainId})
  let account = ''
  let chainID = ''
  console.log(provider)
  console.log(await provider.getSigner())
  try {
    account = await provider.send('eth_requestAccounts', [])
    // account = await provider.getSigner()
  } catch (error) {
    console.log(error)
  }
  try {
    chainID = await provider.send('eth_chainId', [])
    // account = await provider.getSigner()
  } catch (error) {
    console.log(error)
  }
  console.log(account)
  // const chainID = await provider.send('eth_chainId', [])
  console.log(chainID)
  // console.log(ethers.BigNumber.from(chainID))
  // console.log(ethers.BigNumber.from(chainID).toString())
  // console.log(ethers.BigNumber.from(chainID).toNumber())
  return {
    chainId: chainID ? ethers.BigNumber.from(chainID).toString() : '',
    account: account ? account[0]?.toLowerCase() : ''
  }
}