import { Currency, currencyEquals, JSBI, Price } from '@memeswap/sdk'
import tokens from 'config/constants/tokens'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMemo } from 'react'
import { multiplyPriceByAmount } from 'utils/prices'
import { wrappedCurrency } from '../utils/wrappedCurrency'
import { PairState, usePairs } from './usePairs'

const { wvlx: WVLX, busd } = tokens

/**
 * Returns the price in BUSD of the input currency
 * @param currency currency to compute the BUSD price of
 */
export default function useBUSDPrice(currency?: Currency): Price | undefined {
  const { chainId } = useActiveWeb3React()
  const wrapped = wrappedCurrency(currency, chainId)
  
  // Safe-guard: if busd is undefined (e.g., on Monad), return undefined early
  const tokenPairs: [Currency | undefined, Currency | undefined][] = useMemo(
    () => {
      if (!busd || !WVLX) {
        return [[undefined, undefined], [undefined, undefined], [undefined, undefined]]
      }
      return [
        [chainId && wrapped && currencyEquals(WVLX, wrapped) ? undefined : currency, chainId ? WVLX : undefined],
        [wrapped && busd && wrapped.equals(busd) ? undefined : wrapped, busd],
        [chainId ? WVLX : undefined, busd],
      ]
    },
    [chainId, currency, wrapped],
  )
  const [[bnbPairState, bnbPair], [busdPairState, busdPair], [busdBnbPairState, busdBnbPair]] = usePairs(tokenPairs)

  return useMemo(() => {
    // Early return if essential tokens are undefined (e.g., on Monad chain)
    if (!currency || !wrapped || !chainId || !busd || !WVLX) {
      return undefined
    }
    // handle wvlx/vlx
    if (wrapped.equals(WVLX)) {
      if (busdPair) {
        const price = busdPair.priceOf(WVLX)
        return new Price(currency, busd, price.denominator, price.numerator)
      }
      return undefined
    }
    // handle busd
    if (wrapped.equals(busd)) {
      return new Price(busd, busd, '1', '1')
    }

    const bnbPairBNBAmount = bnbPair?.reserveOf(WVLX)
    const bnbPairBNBBUSDValue: JSBI =
      bnbPairBNBAmount && busdBnbPair ? busdBnbPair.priceOf(WVLX).quote(bnbPairBNBAmount).raw : JSBI.BigInt(0)

    // all other tokens
    // first try the busd pair
    if (busdPairState === PairState.EXISTS && busdPair && busdPair.reserveOf(busd).greaterThan(bnbPairBNBBUSDValue)) {
      const price = busdPair.priceOf(wrapped)
      return new Price(currency, busd, price.denominator, price.numerator)
    }
    if (bnbPairState === PairState.EXISTS && bnbPair && busdBnbPairState === PairState.EXISTS && busdBnbPair) {
      if (busdBnbPair.reserveOf(busd).greaterThan('0') && bnbPair.reserveOf(WVLX).greaterThan('0')) {
        const bnbBusdPrice = busdBnbPair.priceOf(busd)
        const currencyBnbPrice = bnbPair.priceOf(WVLX)
        const busdPrice = bnbBusdPrice.multiply(currencyBnbPrice).invert()
        return new Price(currency, busd, busdPrice.denominator, busdPrice.numerator)
      }
    }

    return undefined
  }, [chainId, currency, bnbPair, bnbPairState, busdBnbPair, busdBnbPairState, busdPair, busdPairState, wrapped, busd, WVLX])
}

export const useCakeBusdPrice = (): Price | undefined => {
  const cakeBusdPrice = useBUSDPrice(tokens.cake)
  return cakeBusdPrice
}

export const useBUSDCurrencyAmount = (currency: Currency, amount: number): number | undefined => {
  const { chainId } = useActiveWeb3React()
  const busdPrice = useBUSDPrice(currency)
  const wrapped = wrappedCurrency(currency, chainId)
  if (busdPrice) {
    return multiplyPriceByAmount(busdPrice, amount, wrapped.decimals)
  }
  return undefined
}

export const useBUSDCakeAmount = (amount: number): number | undefined => {
  const cakeBusdPrice = useCakeBusdPrice()
  if (cakeBusdPrice) {
    return multiplyPriceByAmount(cakeBusdPrice, amount)
  }
  return undefined
}

export const useBNBBusdPrice = (): Price | undefined => {
  const bnbBusdPrice = useBUSDPrice(tokens.wvlx)
  return bnbBusdPrice
}
