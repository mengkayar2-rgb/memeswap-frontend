import { Token } from '@memeswap/sdk'
import { pack, keccak256 } from '@ethersproject/solidity'
import { getCreate2Address } from '@ethersproject/address'
import addresses from 'config/constants/addresses.json'

// Monad chainId
const MONAD = 143

// Factory addresses per chain
const FACTORY_ADDRESS_MAP: { [chainId: number]: string } = {
  [MONAD]: addresses[143].WagyuFactory,
  106: addresses[106].WagyuFactory,
  111: addresses[111].WagyuFactory,
}

// Init code hash per chain
const INIT_CODE_HASH_MAP: { [chainId: number]: string } = {
  [MONAD]: addresses[143].PancakeFactory_Init_Code_Hash,
  106: addresses[106].PancakeFactory_Init_Code_Hash,
  111: addresses[111].PancakeFactory_Init_Code_Hash,
}

// Cache for pair addresses
const PAIR_ADDRESS_CACHE: { [chainId: number]: { [token0Address: string]: { [token1Address: string]: string } } } = {}

/**
 * Compute pair address for any chain including Monad
 * This overrides the SDK's Pair.getAddress to support Monad's init code hash
 */
export function computePairAddress(tokenA: Token, tokenB: Token): string {
  const tokens = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
  const chainId = tokens[0].chainId

  // Get chain-specific factory and init code hash
  const factoryAddress = FACTORY_ADDRESS_MAP[chainId] || FACTORY_ADDRESS_MAP[106]
  const initCodeHash = INIT_CODE_HASH_MAP[chainId] || INIT_CODE_HASH_MAP[106]

  if (PAIR_ADDRESS_CACHE?.[chainId]?.[tokens[0].address]?.[tokens[1].address] === undefined) {
    PAIR_ADDRESS_CACHE[chainId] = PAIR_ADDRESS_CACHE[chainId] || {}
    PAIR_ADDRESS_CACHE[chainId][tokens[0].address] = PAIR_ADDRESS_CACHE[chainId][tokens[0].address] || {}
    PAIR_ADDRESS_CACHE[chainId][tokens[0].address][tokens[1].address] = getCreate2Address(
      factoryAddress,
      keccak256(['bytes'], [pack(['address', 'address'], [tokens[0].address, tokens[1].address])]),
      initCodeHash
    )
  }

  return PAIR_ADDRESS_CACHE[chainId][tokens[0].address][tokens[1].address]
}

/**
 * Get factory address for a chain
 */
export function getFactoryAddress(chainId: number): string {
  return FACTORY_ADDRESS_MAP[chainId] || FACTORY_ADDRESS_MAP[106]
}

/**
 * Get init code hash for a chain
 */
export function getInitCodeHash(chainId: number): string {
  return INIT_CODE_HASH_MAP[chainId] || INIT_CODE_HASH_MAP[106]
}

export { FACTORY_ADDRESS_MAP, INIT_CODE_HASH_MAP }
