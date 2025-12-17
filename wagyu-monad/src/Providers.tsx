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
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { GRAPH_URL } from 'config/constants/endpoints'

// Monad chainId
const MONAD = 143

// Fallback subgraph URL for Monad
const MONAD_SUBGRAPH_URL = 'https://api.goldsky.com/api/public/project_cmj7jnjbsro2301stdkaz9yfm/subgraphs/monad-dex/1.0.0/gn'

// Apollo Client for subgraph with fallback
const apolloClient = new ApolloClient({
  uri: GRAPH_URL?.[MONAD] || MONAD_SUBGRAPH_URL,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
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
  )
}

export default Providers
