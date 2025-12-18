import { TokenAmount, Currency, Pair, Token } from '@memeswap/sdk'
import { useMemo } from 'react'
import { Interface } from '@ethersproject/abi'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMultipleContractSingleData } from '../state/multicall/hooks'
import { wrappedCurrency } from '../utils/wrappedCurrency'

// Minimal ABI for getReserves
const PAIR_ABI = [
  {
    constant: true,
    inputs: [],
    name: 'getReserves',
    outputs: [
      { internalType: 'uint112', name: '_reserve0', type: 'uint112' },
      { internalType: 'uint112', name: '_reserve1', type: 'uint112' },
      { internalType: 'uint32', name: '_blockTimestampLast', type: 'uint32' },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
]

const PAIR_INTERFACE = new Interface(PAIR_ABI)

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export function usePairs(currencies: [Currency | undefined, Currency | undefined][]): [PairState, Pair | null][] {
  const { chainId } = useActiveWeb3React()

  // NULL-CHECK 1: Ensure currencies is valid array
  const safeCurrencies = useMemo(() => {
    if (!currencies) return []
    if (!Array.isArray(currencies)) return []
    return currencies.filter((pair) => pair && Array.isArray(pair))
  }, [currencies])

  const tokens = useMemo(
    () =>
      safeCurrencies.map(([currencyA, currencyB]) => {
        try {
          return [
            wrappedCurrency(currencyA, chainId),
            wrappedCurrency(currencyB, chainId),
          ]
        } catch {
          return [undefined, undefined]
        }
      }),
    [chainId, safeCurrencies],
  )

  const pairAddresses = useMemo(
    () =>
      tokens.map(([tokenA, tokenB]) => {
        try {
          // NULL-CHECK 2: Validate tokens before getting address
          if (!tokenA || !tokenB) return undefined
          if (!tokenA.address || !tokenB.address) return undefined
          if (tokenA.equals(tokenB)) return undefined
          return Pair.getAddress(tokenA, tokenB)
        } catch {
          return undefined
        }
      }),
    [tokens],
  )

  const results = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getReserves')

  return useMemo(() => {
    // NULL-CHECK 3: Ensure results is valid
    if (!results) return []
    if (!Array.isArray(results)) return []
    if (results.length === 0) return []

    return results.map((result, i) => {
      try {
        // Safe destructuring with defaults
        const { result: reserves, loading } = result || { result: null, loading: true }
        const tokenA = tokens[i]?.[0]
        const tokenB = tokens[i]?.[1]

        if (loading) return [PairState.LOADING, null]
        if (!tokenA || !tokenB) return [PairState.INVALID, null]
        if (tokenA.equals(tokenB)) return [PairState.INVALID, null]
        if (!reserves) return [PairState.NOT_EXISTS, null]
        
        const { _reserve0, _reserve1 } = reserves
        if (!_reserve0 || !_reserve1) return [PairState.NOT_EXISTS, null]
        
        const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
        
        return [
          PairState.EXISTS,
          new Pair(
            new TokenAmount(token0, _reserve0.toString()),
            new TokenAmount(token1, _reserve1.toString())
          ),
        ]
      } catch (error) {
        console.warn('[usePairs] Error processing pair:', error)
        return [PairState.INVALID, null]
      }
    })
  }, [results, tokens])
}

export function usePair(tokenA?: Currency, tokenB?: Currency): [PairState, Pair | null] {
  const input = useMemo<[Currency | undefined, Currency | undefined][]>(() => [[tokenA, tokenB]], [tokenA, tokenB])
  return usePairs(input)[0]
}

export default usePairs
