import { ChainId, Currency, CurrencyAmount, ETHER, Token, TokenAmount, WETH } from '@memeswap/sdk'

// Use WETH from memeswap-sdk which has Monad (143) built-in
export function wrappedCurrency(currency: Currency | undefined, chainId: ChainId | number | undefined): Token | undefined {
  if (!chainId) return undefined
  if (currency === ETHER) return WETH[chainId]
  return currency instanceof Token ? currency : undefined
}

export function wrappedCurrencyAmount(
  currencyAmount: CurrencyAmount | undefined,
  chainId: ChainId | number | undefined,
): TokenAmount | undefined {
  const token = currencyAmount && chainId ? wrappedCurrency(currencyAmount.currency, chainId) : undefined
  return token && currencyAmount ? new TokenAmount(token, currencyAmount.raw) : undefined
}

export function unwrappedToken(token: Token): Currency {
  const weth = WETH[token.chainId]
  if (weth && token.equals(weth)) return ETHER
  return token
}
