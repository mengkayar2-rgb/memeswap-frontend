import { ChainId, Currency, CurrencyAmount, ETHER, Token, TokenAmount, WETH } from '@pancakeswap-libs/sdk-v2'
import { getWNative } from '../constants/wnative'

export function wrappedCurrency(currency: Currency | undefined, chainId: ChainId | undefined): Token | undefined {
  // eslint-disable-next-line no-nested-ternary
  return chainId && currency === ETHER ? getWNative(chainId) : currency instanceof Token ? currency : undefined
}

export function wrappedCurrencyAmount(
  currencyAmount: CurrencyAmount | undefined,
  chainId: ChainId | undefined
): TokenAmount | undefined {
  const token = currencyAmount && chainId ? wrappedCurrency(currencyAmount.currency, chainId) : undefined
  return token && currencyAmount ? new TokenAmount(token, currencyAmount.raw) : undefined
}

export function unwrappedToken(token: Token): Currency {
  const wnative = getWNative(token.chainId)
  if (wnative && token.equals(wnative)) return ETHER
  return token
}
