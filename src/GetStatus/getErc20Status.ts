import {
  swapinStatusUrl,
  swapoutStatusUrl,
  Status,
  ChainId,
  networks
} from '../constants'
import {
  getUrlData,
} from '../Tools'

import {web3Fn} from '../Wallet/web3'

function getStatus (status:number) {
  let statusType = ''
  if ([0, 5, 8].includes(status)) {
    statusType = Status.Confirming
  } else if ([7, 9].includes(status)) {
    statusType = Status.Minting
  } else if ([10].includes(status)) {
    statusType = Status.Success
  } else if ([1, 2, 3, 4, 6, 11].includes(status)) {
    statusType = Status.Failure
  } else if ([20].includes(status)) {
    statusType = Status.Timeout
  }
  return statusType
}

interface StatusParams {
  hash:string,
  account:string,
  destChainID: ChainId,
  pairid:string,
  srcChainID:string | number,
  type?:string,
}

function GetTxnStatusAPI ({
  hash,
  account,
  destChainID,
  pairid,
  srcChainID,
  type,
}: StatusParams) {
  return new Promise(resolve => {
    const url = `${type === 'swapin' ? swapinStatusUrl : swapoutStatusUrl}/${account}/${hash}/${destChainID}/${pairid}/${srcChainID}`
    // console.log(url)
    getUrlData({
      url: url
    }).then((res:any) => {
      if (res.msg === Status.Success) {
        resolve(res.info)
      } else {
        resolve('')
      }
    })
  })
}

function getChainStatus ({
  hash,
  chainId
}:{
  hash: string,
  chainId: ChainId
}) {
  return new Promise(resolve => {
    web3Fn.setProvider(networks[chainId])
    web3Fn.eth.getTransactionReceipt(hash).then((res:any) => {
      if (res) {
        if (res.status) {
          resolve({
            status: Status.Success,
            hash: hash
          })
        } else {
          resolve({
            status: Status.Failure,
            hash: hash
          })
        }
      } else {
        resolve({
          status: Status.Pending,
          hash: hash
        })
      }
    }).catch(() => {
      resolve({
        status: Status.Pending,
        hash: hash
      })
    })
  })
}

export function getSwapStatus ({
  hash,
  account,
  destChainID,
  pairid,
  srcChainID,
  type
}: StatusParams) {
  return new Promise(resolve => {
    getChainStatus({hash: hash, chainId: destChainID}).then((res:any) => {
      if (res.status === Status.Success) {
        GetTxnStatusAPI({
          hash,
          account,
          destChainID,
          pairid,
          srcChainID,
          type: type,
        }).then((results:any) => {
          if (results) {
            resolve({
              ...res,
              swapHash: results.swaptx,
              swapStatus: getStatus(results.status),
              swapTime: results.txtime,
            })
          } else {
            resolve(res)
          }
        })
      } else {
        resolve(res)
      }
    })
  })
}

export function getDepositStatus ({
  hash,
  account,
  destChainID,
  pairid,
  srcChainID
}: StatusParams) {
  return new Promise(resolve => {
    GetTxnStatusAPI({
      hash,
      account,
      destChainID,
      pairid,
      srcChainID,
      type: 'swapin',
    }).then((results:any) => {
      if (results) {
        let statusType = Status.Pending, status = results.status, outStatus = Status.Pending
        if ([0, 5].includes(status)) {
          statusType = Status.Confirming
        } else if ([8, 9].includes(status)) {
          statusType = Status.Success // fusionsuccess
        } else if ([10].includes(status)) {
          outStatus = Status.Success
          statusType = Status.Success // outnetsuccess
        } else if ([1, 2, 3, 4, 6, 11].includes(status)) {
          outStatus = Status.Failure
          statusType = Status.Failure
        } else if ([20].includes(status)) {
          outStatus = Status.Failure
          statusType = Status.Timeout
        } else {
          statusType = Status.Pending
        }
        resolve({
          hash: hash,
          status: outStatus,
          swapHash: results.swaptx,
          swapStatus: statusType,
          swapTime: results.txtime,
        })
      } else {
        resolve({
          status: Status.Pending,
          hash: hash
        })
      }
    })
  })
}