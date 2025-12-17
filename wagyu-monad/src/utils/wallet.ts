// Set of helper functions to facilitate wallet setup

import { ExternalProvider } from '@ethersproject/providers'
import { ChainId } from '@memeswap/sdk'
import { BAD_SRCS } from 'components/Logo/Logo'
import { BASE_VELAS_SCAN_URLS, MONAD_CHAIN_ID } from 'config'
import { nodes } from './getRpcUrl'

const NETWORK_CONFIG = {
  [MONAD_CHAIN_ID]: {
    name: 'Monad Mainnet',
    scanURL: BASE_VELAS_SCAN_URLS[MONAD_CHAIN_ID],
    nativeCurrency: {
      name: 'MON',
      symbol: 'MON',
      decimals: 18,
    },
  },
  [ChainId.MAINNET]: {
    name: 'Velas Mainnet',
    scanURL: BASE_VELAS_SCAN_URLS[ChainId.MAINNET],
    nativeCurrency: {
      name: 'VLX',
      symbol: 'VLX',
      decimals: 18,
    },
  },
  [ChainId.TESTNET]: {
    name: 'Velas Testnet',
    scanURL: BASE_VELAS_SCAN_URLS[ChainId.TESTNET],
    nativeCurrency: {
      name: 'VLX',
      symbol: 'VLX',
      decimals: 18,
    },
  },
}

/**
 * Prompt the user to add network on Metamask, or switch to it if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
export const setupNetwork = async (externalProvider?: ExternalProvider) => {
  const provider = externalProvider || window.ethereum
  const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID, 10) as keyof typeof NETWORK_CONFIG
  if (!NETWORK_CONFIG[chainId]) {
    console.error('Invalid chain id')
    return false
  }
  if (provider) {
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      })
      return true
    } catch (switchError) {
      if ((switchError as any)?.code === 4902) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${chainId.toString(16)}`,
                chainName: NETWORK_CONFIG[chainId].name,
                nativeCurrency: NETWORK_CONFIG[chainId].nativeCurrency,
                rpcUrls: nodes,
                blockExplorerUrls: [`${NETWORK_CONFIG[chainId].scanURL}/`],
              },
            ],
          })
          return true
        } catch (error) {
          console.error('Failed to setup the network in Metamask:', error)
          return false
        }
      }
      return false
    }
  } else {
    console.error("Can't setup the network on metamask because window.ethereum is undefined")
    return false
  }
}

/**
 * Add Monad network to wallet
 */
export const addMonadNetwork = async () => {
  if (!window.ethereum) {
    console.error('MetaMask is not installed')
    return false
  }
  
  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: '0x8F', // 143 in hex
        chainName: 'Monad Mainnet',
        nativeCurrency: {
          name: 'MON',
          symbol: 'MON',
          decimals: 18,
        },
        rpcUrls: ['https://rpc.monad.xyz'],
        blockExplorerUrls: ['https://explorer.monad.xyz'],
      }],
    })
    return true
  } catch (error) {
    console.error('Failed to add Monad network:', error)
    return false
  }
}

/**
 * Prompt the user to add a custom token to metamask
 * @param tokenAddress
 * @param tokenSymbol
 * @param tokenDecimals
 * @returns {boolean} true if the token has been added, false otherwise
 */
export const registerToken = async (
  tokenAddress: string,
  tokenSymbol: string,
  tokenDecimals: number,
  tokenLogo?: string,
) => {
  // better leave this undefined for default image instead of broken image url
  const image = tokenLogo ? (BAD_SRCS[tokenLogo] ? undefined : tokenLogo) : undefined

  const tokenAdded = await window.ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: tokenAddress,
        symbol: tokenSymbol,
        decimals: tokenDecimals,
        image,
      },
    },
  })

  return tokenAdded
}
