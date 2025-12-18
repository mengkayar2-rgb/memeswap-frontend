import { useQuery, gql } from '@apollo/client'
import { Token } from '@memeswap/sdk'
import { useMemo } from 'react'

// Monad chainId
const MONAD_CHAIN_ID = 143

// GraphQL query for tokens from subgraph
const TOKENS_QUERY = gql`
  query GetTokens {
    tokens(first: 100, orderBy: tradeVolumeUSD, orderDirection: desc) {
      id
      symbol
      name
      decimals
      totalLiquidity
      tradeVolumeUSD
      txCount
    }
  }
`

export interface SubgraphToken {
  address: string
  token: Token
  totalLiquidity: string
  tradeVolumeUSD: string
  txCount: string
}

export function useSubgraphTokens(): { tokens: SubgraphToken[]; loading: boolean; error: any } {
  const queryResult = useQuery(TOKENS_QUERY, {
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  })

  // Safe destructuring with defaults
  const data = queryResult?.data
  const loading = queryResult?.loading ?? false
  const error = queryResult?.error ?? null

  const tokens = useMemo(() => {
    // NULL-CHECK 1: Check loading state
    if (loading) {
      console.log('[useSubgraphTokens] Still loading...')
      return []
    }
    
    // NULL-CHECK 2: Check error state
    if (error) {
      console.warn('[useSubgraphTokens] Query error:', error)
      return []
    }
    
    // NULL-CHECK 3: Check data existence and structure
    if (!data) {
      console.log('[useSubgraphTokens] No data received')
      return []
    }
    if (!data.tokens) {
      console.log('[useSubgraphTokens] No tokens in data')
      return []
    }
    if (!Array.isArray(data.tokens)) {
      console.warn('[useSubgraphTokens] tokens is not an array')
      return []
    }
    if (data.tokens.length === 0) {
      console.log('[useSubgraphTokens] Empty tokens array')
      return []
    }

    // Parse with strict filtering
    return data.tokens
      .filter((t: any) => {
        // Strict validation: must have id
        if (!t) return false
        if (!t.id) return false
        if (typeof t.id !== 'string') return false
        if (t.id.length !== 42) return false // Valid address length
        return true
      })
      .map((t: any) => {
        try {
          return {
            address: t.id || '',
            token: new Token(
              MONAD_CHAIN_ID,
              t.id || '0x0000000000000000000000000000000000000000',
              parseInt(t.decimals, 10) || 18,
              t.symbol || 'UNKNOWN',
              t.name || 'Unknown Token'
            ),
            totalLiquidity: t.totalLiquidity || '0',
            tradeVolumeUSD: t.tradeVolumeUSD || '0',
            txCount: t.txCount || '0',
          }
        } catch (err) {
          console.warn('[useSubgraphTokens] Error parsing token:', t.id, err)
          return null
        }
      })
      .filter(Boolean) // Remove any null entries from failed parsing
  }, [data, loading, error])

  return { tokens: tokens || [], loading, error }
}

// Hook to get a single token by address
export function useSubgraphToken(tokenAddress: string): { token: SubgraphToken | null; loading: boolean; error: any } {
  const TOKEN_QUERY = gql`
    query GetToken($id: ID!) {
      token(id: $id) {
        id
        symbol
        name
        decimals
        totalLiquidity
        tradeVolumeUSD
        txCount
      }
    }
  `

  const queryResult = useQuery(TOKEN_QUERY, {
    variables: { id: tokenAddress?.toLowerCase() || '' },
    skip: !tokenAddress,
    errorPolicy: 'all',
  })

  // Safe destructuring
  const data = queryResult?.data
  const loading = queryResult?.loading ?? false
  const error = queryResult?.error ?? null

  const token = useMemo(() => {
    if (loading || error || !data?.token) return null

    const t = data.token
    if (!t || !t.id) return null

    return {
      address: t.id || '',
      token: new Token(
        MONAD_CHAIN_ID,
        t.id || '0x0000000000000000000000000000000000000000',
        parseInt(t.decimals, 10) || 18,
        t.symbol || 'UNKNOWN',
        t.name || 'Unknown Token'
      ),
      totalLiquidity: t.totalLiquidity || '0',
      tradeVolumeUSD: t.tradeVolumeUSD || '0',
      txCount: t.txCount || '0',
    }
  }, [data, loading, error])

  return { token, loading, error }
}

export default useSubgraphTokens
