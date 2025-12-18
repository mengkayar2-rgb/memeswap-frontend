import { Pair as PancakePair, Token } from '@pancakeswap-libs/sdk-v2'
import { getCreate2Address } from '@ethersproject/address'
import { keccak256, pack } from '@ethersproject/solidity'

export const FACTORY_ADDRESS = '0xb48dBe6D4130f4a664075250EE702715748051d9'
export const INIT_CODE_HASH = '0x67bc0babb7c46b28f84870387b02369e61d55e3b07da260cfeb73b382d275293'

export class Pair extends PancakePair {
  static getAddress(tokenA: Token, tokenB: Token): string {
    if (tokenA.chainId === 143 && tokenB.chainId === 143) {
      const tokens = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
      return getCreate2Address(
        FACTORY_ADDRESS,
        keccak256(['bytes'], [pack(['address', 'address'], [tokens[0].address, tokens[1].address])]),
        INIT_CODE_HASH
      )
    }
    return PancakePair.getAddress(tokenA, tokenB)
  }
}

export { Token } from '@pancakeswap-libs/sdk-v2'
