import { Currency, ETHER, Token, MONAD_CHAIN_ID } from '@memeswap/sdk'
import { CHAIN_ID } from 'config/constants/networks'

// Get native currency symbol based on chain
const NATIVE_SYMBOL = parseInt(CHAIN_ID, 10) === MONAD_CHAIN_ID ? 'MON' : 'VLX'

export function currencyId(currency: Currency): string {
  if (currency === ETHER) return NATIVE_SYMBOL
  if (currency instanceof Token) return currency.address
  throw new Error('invalid currency')
}

export default currencyId
