const bitcoin = require('bitcoinjs-lib')
const OPS = require('bitcoin-ops')

// const NETWORK = config.env === 'test' ? bitcoin.networks.testnet : bitcoin.networks.bitcoin
const NETWORK = bitcoin.networks.bitcoin
const LITECOIN = {
  messagePrefix: '\x19Litecoin Signed Message:\n',
  bech32: 'ltc',
  bip32: {
    public: 0x019da462,
    private: 0x019d9cfe,
  },
  pubKeyHash: 0x30,
  scriptHash: 0x32,
  wif: 0xb0,
}

const BLOCK = {
  messagePrefix: '\x19Blocknet Signed Message:\n',
  bech32: 'block',
  bip32: {
   public: 0x0488B21E,
   private: 0x0488ADE4
  },
  
  pubKeyHash: 0x1a,
  scriptHash: 0x1c,
  wif: 0x9a,
}

function getNetwork (coin?:string) {
  let network = NETWORK
  coin = coin ? coin.toUpperCase() : ''
  if (coin.indexOf('BTC') !== -1) {
    network = NETWORK
  } else if (coin.indexOf('LTC') !== -1) {
    network = LITECOIN
  } else if (coin.indexOf('BLOCK') !== -1) {
    network = BLOCK
  } 
  return network
}

export function createAddress (address:string, coin:string | undefined, initAddr:string) {
  let network = getNetwork(coin)
  address = address.replace('0x', '')
  const {hash} = bitcoin.address.fromBase58Check(initAddr)

  const reddemScript = bitcoin.script.compile([
    Buffer.from(address, 'hex'),
    OPS.OP_DROP,
    OPS.OP_DUP,
    OPS.OP_HASH160,
    Buffer.from(hash,'hex'),
    OPS.OP_EQUALVERIFY,
    OPS.OP_CHECKSIG,
  ])
  const output = bitcoin.script.compile([
    OPS.OP_HASH160,
    bitcoin.crypto.hash160(reddemScript),
    OPS.OP_EQUAL,
  ])
  const p2shAddress = bitcoin.payments.p2sh({
    output: output,
    network: network,
  })
  // console.log(p2shAddress.address)
  return p2shAddress.address;
}

export function isSpecAddress (address:string, coin?:string) {
  let network = getNetwork(coin)
  try {
    return bitcoin.address.toOutputScript(address, network)
  } catch (error) {
    return false
  }
}