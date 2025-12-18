import { Pair } from '@uniswap/v2-sdk'
import { useMemo } from 'react'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import { Interface } from '@ethersproject/abi'
import { useMultipleContractSingleData } from '../state/multicall/hooks'
import { Currency, CurrencyAmount } from '@uniswap/sdk-core'
import { getCreate2Address } from '@ethersproject/address'
import { pack, keccak256 } from '@ethersproject/solidity'

const PAIR_INTERFACE = new Interface(IUniswapV2PairABI)

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

const MONAD_FACTORY_ADDRESS = '0xb48dBe6D4130f4a664075250EE702715748051d9'
const MONAD_INIT_CODE_HASH = '0x67bc0babb7c46b28f84870387b02369e61d55e3b07da260cfeb73b382d275293'

function computeMonadPairAddress(tokenA: Currency, tokenB: Currency): string {
  const [token0, token1] = tokenA.wrapped.sortsBefore(tokenB.wrapped)
    ? [tokenA.wrapped, tokenB.wrapped]
    : [tokenB.wrapped, tokenA.wrapped]
  return getCreate2Address(
    MONAD_FACTORY_ADDRESS,
    keccak256(['bytes'], [pack(['address', 'address'], [token0.address, token1.address])]),
    MONAD_INIT_CODE_HASH
  )
}

export function useV2Pairs(currencies: [Currency | undefined, Currency | undefined][]): [PairState, Pair | null][] {
  const tokens = useMemo(
    () => currencies.map(([currencyA, currencyB]) => [currencyA?.wrapped, currencyB?.wrapped]),
    [currencies]
  )

  const pairAddresses = useMemo(
    () =>
      tokens.map(([tokenA, tokenB]) => {
        if (!(tokenA && tokenB) || tokenA.equals(tokenB)) return undefined
        return tokenA.chainId === 143 ? computeMonadPairAddress(tokenA, tokenB) : Pair.getAddress(tokenA, tokenB)
      }),
    [tokens]
  )

  const results = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getReserves')

  return useMemo(() => {
    return results.map((result, i) => {
      const { result: reserves, loading } = result
      const tokenA = tokens[i][0]
      const tokenB = tokens[i][1]

      if (loading) return [PairState.LOADING, null]
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null]
      if (!reserves) return [PairState.NOT_EXISTS, null]
      const { reserve0, reserve1 } = reserves
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
      return [
        PairState.EXISTS,
        new Pair(
          CurrencyAmount.fromRawAmount(token0, reserve0.toString()),
          CurrencyAmount.fromRawAmount(token1, reserve1.toString())
        ),
      ]
    })
  }, [results, tokens])
}

export function useV2Pair(tokenA?: Currency, tokenB?: Currency): [PairState, Pair | null] {
  const inputs: [[Currency | undefined, Currency | undefined]] = useMemo(() => [[tokenA, tokenB]], [tokenA, tokenB])
  return useV2Pairs(inputs)[0]
}
