import { Pair } from '../memeswap-sdk'
import { Token } from '@pancakeswap-libs/sdk-v2'

export function getPairAddress(tokenA: Token, tokenB: Token, chainId?: number): string {
  return Pair.getAddress(tokenA, tokenB)
}
