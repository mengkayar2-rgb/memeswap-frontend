import { useQuery, gql } from '@apollo/client'
import { Token } from '@memeswap/sdk'
import { useMemo } from 'react'

// Monad chainId
const MONAD_CHAIN_ID = 143

// GraphQL query for pairs from subgraph
const PAIRS_QUERY = gql`
  query GetPairs {
    pairs(first: 100, orderBy: reserveUSD, orderDirection: desc) {
      id
      token0 {
        id
        symbol
        name
        decimals
      }
      token1 {
        id
        symbol
        name
        decimals
      }
      reserve0
      reserve1
      reserveUSD
      totalSupply
      volumeUSD
      txCount
    }
  }
`

export interface SubgraphPair {
  address: string
  token0: Token
  token1: Token
  reserve0: string
  reserve1: string
  reserveUSD: string
  totalSupply: string
  volumeUSD: string
  txCount: string
}

export function useSubgraphPairs(): { pairs: SubgraphPair[]; loading: boolean; error: any } {
  const queryResult = useQuery(PAIRS_QUERY, {
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  })
  
  const data = queryResult?.data
  const loading = queryResult?.loading ?? false
  const error = queryResult?.error ?? null

  const pairs = useMemo(() => {
    if (loading) return []
    if (error) {
      console.warn('[useSubgraphPairs] Query error:', error)
      return []
    }
    if (!data) return []
    if (!data.pairs) return []
    if (!Array.isArray(data.pairs)) return []

    return data.pairs
      .filter((p: any) => p && p.id && p.token0 && p.token1)
      .map((p: any) => ({
        address: p.id || '',
        token0: new Token(
          MONAD_CHAIN_ID,
          p.token0?.id || '0x0000000000000000000000000000000000000000',
          parseInt(p.token0?.decimals, 10) || 18,
          p.token0?.symbol || 'UNKNOWN',
          p.token0?.name || 'Unknown Token'
        ),
        token1: new Token(
          MONAD_CHAIN_ID,
          p.token1?.id || '0x0000000000000000000000000000000000000000',
          parseInt(p.token1?.decimals, 10) || 18,
          p.token1?.symbol || 'UNKNOWN',
          p.token1?.name || 'Unknown Token'
        ),
        reserve0: p.reserve0 || '0',
        reserve1: p.reserve1 || '0',
        reserveUSD: p.reserveUSD || '0',
        totalSupply: p.totalSupply || '0',
        volumeUSD: p.volumeUSD || '0',
        txCount: p.txCount || '0',
      }))
  }, [data, loading, error])

  return { pairs: pairs || [], loading, error }
}

export default useSubgraphPairs
