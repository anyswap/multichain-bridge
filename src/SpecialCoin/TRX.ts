import {Status} from '../constants'

const tronweb = window.tronWeb

export function toHexAddress (address:string) {
  const str = tronweb.address.toHex(address).toLowerCase()
  return '0x' + str.substr(2)
}

export function fromHexAddress (address:string) {
  return '41' + address.substr(2)
}

export async function sendTRXTxns ({
  account,
  toAddress,
  amount,
  symbol,
  tokenID
}: {
  account: string,
  toAddress: string,
  amount: string,
  symbol: string,
  tokenID: string
}) {
  // console.log(tronweb)
  if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
    const TRXAccount = tronweb.defaultAddress.base58
    const curTRXAccount = toHexAddress(TRXAccount)
    if (curTRXAccount === account.toLowerCase()) {
      let tx:any = ''
      try {
        if (symbol === 'TRX') {
          tx = await tronweb.transactionBuilder.sendTrx(toAddress, amount, TRXAccount)
          // console.log(tx)
        } else {
          const parameter1 = [{type:'address',value: toAddress},{type:'uint256',value: amount}]
          tx = await tronweb.transactionBuilder.triggerSmartContract(tokenID, "transfer(address,uint256)", {}, parameter1, TRXAccount)
          tx = tx.transaction
        }
        const signedTx = await tronweb.trx.sign(tx)
        const broastTx = await tronweb.trx.sendRawTransaction(signedTx)
        return {
          msg: Status.Success,
          info: broastTx
        }
      } catch (error) {
        console.log(error)
        return {
          msg: Status.Error,
          error: error.toString()
        }
      }
    } else {
      return {
        msg: Status.Error,
        error: 'Account verification failed!'
      }
    }
  } else {
    return {
      msg: Status.Error,
      error: 'Not Supported!'
    }
  }
}

export function isTRXAddress (address:string) {
  if (address.indexOf('0x') === 0) {
    address = address.replace('0x', '41')
  }
  return tronweb.isAddress(address)
}

// export function getTRXBalance (account, tokenList) {
//   if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
//     const curAccount = fromHexAddress(account)
//     const TRXAccount = tronweb.defaultAddress.base58

//     for (const token in tokenList) {
//       // console.log(token)
//       const obj = tokenList[token]
//       if (obj.symbol === 'TRX') {
//         tronWeb.trx.getBalance(curAccount).then(res => {
//           // console.log(res)
//           setLocalOutBalance(TRX_MAIN_CHAINID, account, 'BASE', {balance: res.toString()})
//           setLocalOutBalance(TRX_MAIN_CHAINID, account, token, {balance: res.toString()})
//         })
//       } else {
//         const parameter1 = [{type:'address',value: curAccount}]
//         const tokenID = BridgeToken[obj.symbol].token
//         tronweb.transactionBuilder.triggerSmartContract(tokenID, "balanceOf(address)", {}, parameter1, TRXAccount).then(res => {
//           // console.log(res)
//           const bl = res.constant_result[0]
//           setLocalOutBalance(TRX_MAIN_CHAINID, account, token, {balance: '0x' + bl.toString()})
//         })
//       }
//     }
//   }
// }

export function getTRXTxnsStatus (txid:string) {
  return new Promise(resolve => {
    if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
      tronweb.trx.getTransaction(txid).then((res:any) => {
        console.log(res)
        if (res.ret) {
          resolve({
            status: true
          })
        } else {
          resolve({
            status: false
          })
        }
      })
    } else {
      resolve({
        status: false
      })
    }
  })
}

export function formatTRXAddress (address:string) {
  if (address.indexOf('0x') === 0) {
    address = address.replace('0x', '41')
    address = tronweb.address.fromHex(address)
  }
  return address
}