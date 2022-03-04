
const Base58 = require('bs58')
const cryptoUtils = require('./crypto-utils')
const AddressLength = 26;
const AddressPrefix = 25;
const NormalType = 87;
const ContractType = 88;

// const KeyVersion3 = 3;
// const KeyCurrentVersion = 4;
const isString = function (obj:any) {
  return typeof obj === 'string' && obj.constructor === String;
}
const isNumber = function (object:any) {
	return typeof object === 'number';
}
export const isNASAddress = function (addr:any, type?:any) {
  /*jshint maxcomplexity:10 */

  if (isString(addr)) {
      try {
          addr = Base58.decode(addr);
      } catch (e) {
          console.log("invalid address.");
          // if address can't be base58 decode, return false.
          return false;
      }
  } else if (!Buffer.isBuffer(addr)) {
      return false;
  }
  // address not equal to 26
  if (addr.length !== AddressLength) {
      return false;
  }

  // check if address start with AddressPrefix
  const buff = Buffer.from(addr);
  if (buff.readUIntBE(0, 1) !== AddressPrefix) {
      return false;
  }

  // check if address type is NormalType or ContractType
  const t = buff.readUIntBE(1, 1);
  if (isNumber(type) && (type === NormalType || type === ContractType)) {
      if (t !== type) {
          return false;
      }
  } else if (t !== NormalType && t !== ContractType) {
      return false;
  }
  const content = addr.slice(0, 22);
  const checksum = addr.slice(-4);
  return Buffer.compare(cryptoUtils.sha3(content).slice(0, 4), checksum) === 0;
}