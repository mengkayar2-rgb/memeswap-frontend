import { INFO_CLIENT } from 'config/constants/endpoints'
import { GraphQLClient } from 'graphql-request'

// Dummy endpoint for when subgraph is disabled (Monad)
const DUMMY_ENDPOINT = 'https://api.thegraph.com/subgraphs/name/dummy'

// Extra headers
// Mostly for dev environment
// No production env check since production preview might also need them
export const getGQLHeaders = (endpoint: string) => {
  if (!endpoint || !INFO_CLIENT) return undefined
  if (endpoint === INFO_CLIENT) {
    return {
      'X-Sf':
        process.env.NEXT_PUBLIC_SF_HEADER ||
        // hack for inject CI secret on window
        (typeof window !== 'undefined' &&
          // @ts-ignore
          window.sfHeader),
    }
  }
  return undefined
}

// Use dummy endpoint if INFO_CLIENT is null (Monad - subgraph disabled)
const clientEndpoint = INFO_CLIENT || DUMMY_ENDPOINT

export const infoClient = new GraphQLClient(clientEndpoint, { headers: getGQLHeaders(clientEndpoint) })

export const infoServerClient = new GraphQLClient(clientEndpoint, {
  // headers: {
  //   'X-Sf': process.env.SF_HEADER,
  // },
  timeout: 5000,
})

export const bitQueryServerClient = new GraphQLClient(process.env.NEXT_PUBLIC_BIT_QUERY_ENDPOINT || DUMMY_ENDPOINT, {
  headers: {
    // only server, no `NEXT_PUBLIC` not going to expose in client
    'X-API-KEY': process.env.BIT_QUERY_HEADER,
  },
  timeout: 5000,
})

// Helper to check if subgraph is available
export const isSubgraphAvailable = () => !!INFO_CLIENT
