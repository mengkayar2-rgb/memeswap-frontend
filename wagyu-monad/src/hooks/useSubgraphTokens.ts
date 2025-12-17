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
    // Multiple safe-guards to prevent destructuring errors
    if (loading) return []
    if (error) {
      console.warn('[useSubgraphTokens] Query error:', error)
      return []
    }
    if (!data) return []
    if (!data.tokens) return []
    if (!Array.isArray(data.tokens)) return []

    return data.tokens
      .filter((t: any) => t && t.id) // Filter invalid tokens
      .map((t: any) => ({
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
      }))
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
