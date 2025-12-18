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
    // NULL-CHECK 1: Check loading state
    if (loading) {
      console.log('[useSubgraphPairs] Still loading...')
      return []
    }
    
    // NULL-CHECK 2: Check error state
    if (error) {
      console.warn('[useSubgraphPairs] Query error:', error)
      return []
    }
    
    // NULL-CHECK 3: Check data existence and structure
    if (!data) {
      console.log('[useSubgraphPairs] No data received')
      return []
    }
    if (!data.pairs) {
      console.log('[useSubgraphPairs] No pairs in data')
      return []
    }
    if (!Array.isArray(data.pairs)) {
      console.warn('[useSubgraphPairs] pairs is not an array')
      return []
    }
    if (data.pairs.length === 0) {
      console.log('[useSubgraphPairs] Empty pairs array')
      return []
    }

    // Parse with strict filtering
    return data.pairs
      .filter((p: any) => {
        // Strict validation
        if (!p) return false
        if (!p.id) return false
        if (!p.token0 || !p.token0.id) return false
        if (!p.token1 || !p.token1.id) return false
        return true
      })
      .map((p: any) => {
        try {
          return {
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
          }
        } catch (err) {
          console.warn('[useSubgraphPairs] Error parsing pair:', p.id, err)
          return null
        }
      })
      .filter(Boolean) // Remove any null entries
  }, [data, loading, error])

  return { pairs: pairs || [], loading, error }
}

export default useSubgraphPairs
