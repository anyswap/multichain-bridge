import {postUrlData} from './getUrlData'
import {recordsTxnsUrl} from '../constants'

interface RecordsTxnsProp {
  hash: string
  chainId:any
  selectChain:any,
  account: string | null | undefined,
  value: any,
  formatvalue: string,
  to: string,
  symbol: string | undefined,
  version?: string | undefined,
  pairid?: string | undefined,
  token?: string | undefined,
}

export function recordsTxns ({
  hash,
  chainId,
  selectChain,
  account,
  value,
  formatvalue,
  to,
  symbol,
  version,
  pairid,
  token,
}: RecordsTxnsProp) {
  return new Promise(resolve => {
    // console.log(hash)
    const url = recordsTxnsUrl
    const useVersion = version
    // console.log(version)
    // console.log(USE_VERSION)
    postUrlData({url, params: {
      hash: hash,
      srcChainID: chainId,
      destChainID: selectChain,
      token: token,
      from: account,
      version: useVersion,
      value: value,
      formatvalue: formatvalue,
      to: to,
      symbol: symbol,
      pairid: pairid
    }}).then(res => {
      console.log(res)
      resolve(res)
    })
  })
}

// recordsTxns({
//   hash: '0xc3962971894361611fc86cdbe980cf85d050841dc988629c4f25998e71bcd512',
//   chainId: "56",
//   selectChain: "66",
//   account: "0xc03033d8b833ff7ca08bf2a58c9bc9d711257249",
//   value: "20000000000000000",
//   formatvalue: "",
//   to: "0x63a3d28bB9187809553dD16981C73f498B6b2687",
//   symbol: "",
//   version: "swapin",
//   pairid: "BNBv5",
// })