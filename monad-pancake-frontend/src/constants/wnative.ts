import { Token, WETH } from '@pancakeswap-libs/sdk'
import { getAddress } from '@ethersproject/address'

export const WMON = new Token(143, getAddress('0xFfDFF1bAb47d8e6D1Da119F5C925fAC91FAfA899'), 18, 'WMON', 'Wrapped Monad')

export function getWNative(chainId: number) {
  if (chainId === 143) return WMON
  return WETH[chainId]
}
