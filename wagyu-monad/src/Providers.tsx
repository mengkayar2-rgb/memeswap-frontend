import { ModalProvider, light, dark } from 'packages/uikit'
import { Web3ReactProvider } from '@web3-react/core'
import { Provider } from 'react-redux'
import { SWRConfig } from 'swr'
import { ThemeProvider } from 'styled-components'
import { getLibrary } from 'utils/web3React'
import { LanguageProvider } from 'contexts/Localization'
import { ToastsProvider } from 'contexts/ToastsContext'
import { fetchStatusMiddleware } from 'hooks/useSWRContract'
import { Store } from '@reduxjs/toolkit'
import { ThemeProvider as NextThemeProvider, useTheme as useNextTheme } from 'next-themes'
import { ApolloClient, ApolloProvider, InMemoryCache, from, HttpLink } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { RetryLink } from '@apollo/client/link/retry'
import { GRAPH_URL } from 'config/constants/endpoints'
import ErrorBoundaryStrict from 'components/ErrorBoundaryStrict'

// Monad chainId
const MONAD = 143

// Fallback subgraph URL for Monad
const MONAD_SUBGRAPH_URL = 'https://api.goldsky.com/api/public/project_cmj7jnjbsro2301stdkaz9yfm/subgraphs/monad-dex/1.0.0/gn'

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.warn(`[GraphQL Error] Message: ${message}, Path: ${path}`)
    })
  }
  if (networkError) {
    console.warn(`[Network Error] ${networkError.message}`)
  }
})

// Retry link - retry 3x on failure
const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: 3000,
    jitter: true,
  },
  attempts: {
    max: 3,
    retryIf: (error) => !!error,
  },
})

// HTTP link
const httpLink = new HttpLink({
  uri: GRAPH_URL?.[MONAD] || MONAD_SUBGRAPH_URL,
})

// Apollo Client for subgraph with retry & error handling
const apolloClient = new ApolloClient({
  link: from([errorLink, retryLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
})

const StyledThemeProvider = (props) => {
  const { resolvedTheme } = useNextTheme()
  // return <ThemeProvider theme={resolvedTheme === 'dark' ? dark : light} {...props} />
  return <ThemeProvider theme={light} {...props} />
}

const Providers: React.FC<{ store: Store }> = ({ children, store }) => {
  return (
    <ErrorBoundaryStrict>
      <ApolloProvider client={apolloClient}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Provider store={store}>
            <ToastsProvider>
              <NextThemeProvider>
                <StyledThemeProvider>
                  <LanguageProvider>
                    <SWRConfig
                      value={{
                        use: [fetchStatusMiddleware],
                      }}
                    >
                      <ModalProvider>{children}</ModalProvider>
                    </SWRConfig>
                  </LanguageProvider>
                </StyledThemeProvider>
              </NextThemeProvider>
            </ToastsProvider>
          </Provider>
        </Web3ReactProvider>
      </ApolloProvider>
    </ErrorBoundaryStrict>
  )
}

export default Providers
