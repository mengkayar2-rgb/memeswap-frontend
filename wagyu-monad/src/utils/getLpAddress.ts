import { Token, ChainId } from '@memeswap/sdk'
import { isAddress } from 'utils'
import { CHAIN_ID } from 'config/constants/networks'
import { computePairAddress } from './pairAddress'

// Monad chainId
const MONAD = 143

const getLpAddress = (token1: string | Token, token2: string | Token) => {
  let token1AsTokenInstance = token1
  let token2AsTokenInstance = token2
  if (!token1 || !token2) {
    return null
  }
  
  // Determine chainId - use Monad if configured, otherwise mainnet
  const chainId = parseInt(CHAIN_ID, 10)
  const targetChainId = chainId === MONAD ? (MONAD as any) : ChainId.MAINNET
  
  if (typeof token1 === 'string' || token1 instanceof String) {
    const checksummedToken1Address = isAddress(token1)
    if (!checksummedToken1Address) {
      return null
    }
    token1AsTokenInstance = new Token(targetChainId, checksummedToken1Address, 18)
  }
  if (typeof token2 === 'string' || token2 instanceof String) {
    const checksummedToken2Address = isAddress(token2)
    if (!checksummedToken2Address) {
      return null
    }
    token2AsTokenInstance = new Token(targetChainId, checksummedToken2Address, 18)
  }
  // Use computePairAddress for Monad support with correct init code hash
  return computePairAddress(token1AsTokenInstance as Token, token2AsTokenInstance as Token)
}

export default getLpAddress
