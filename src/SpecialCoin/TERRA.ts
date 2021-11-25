import { AccAddress } from '@terra-money/terra.js'
export function isTERRAAddress (address:string) {
  if (
    AccAddress.validate(address)
  ) {
    return address
  }
  return false
}