/**
 * MemeSwap SDK - Local Vendored Version for Monad Chain
 * This is a self-contained SDK to avoid external dependency issues on Vercel
 */

import JSBI from 'jsbi'
import { getAddress, getCreate2Address } from '@ethersproject/address'
import { keccak256, pack } from '@ethersproject/solidity'
import { BigNumber } from '@ethersproject/bignumber'

// ============ CONSTANTS ============

export enum ChainId {
  MAINNET = 56,
  TESTNET = 97,
  MONAD = 143,
}

export const MONAD_CHAIN_ID = 143

export enum TradeType {
  EXACT_INPUT,
  EXACT_OUTPUT,
}

export enum Rounding {
  ROUND_DOWN,
  ROUND_HALF_UP,
  ROUND_UP,
}

// Factory addresses per chain
export const FACTORY_ADDRESS_MAP: { [chainId: number]: string } = {
  [ChainId.MAINNET]: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
  [ChainId.TESTNET]: '0x6725f303b657a9451d8ba641348b6761a6cc7a17',
  [ChainId.MONAD]: '0xb48dBe6D4130f4a664075250EE702715748051d9',
}

export const FACTORY_ADDRESS = FACTORY_ADDRESS_MAP[ChainId.MONAD]

// Init code hash per chain
export const INIT_CODE_HASH_MAP: { [chainId: number]: string } = {
  [ChainId.MAINNET]: '0x00fb7f630766e6a796048ea87d01acd3068e8ff67d078148a3fa3f4a84f69bd5',
  [ChainId.TESTNET]: '0xd0d4c4cd0848c93cb4fd1f498d7013ee6bfb25783ea21593d5834f5d250ece66',
  [ChainId.MONAD]: '0x67bc0babb7c46b28f84870387b02369e61d55e3b07da260cfeb73b382d275293',
}

export const INIT_CODE_HASH = INIT_CODE_HASH_MAP[ChainId.MONAD]

export const MINIMUM_LIQUIDITY = JSBI.BigInt(1000)

// JSBI constants
export const ZERO = JSBI.BigInt(0)
export const ONE = JSBI.BigInt(1)
export const TWO = JSBI.BigInt(2)
export const THREE = JSBI.BigInt(3)
export const FIVE = JSBI.BigInt(5)
export const TEN = JSBI.BigInt(10)
export const _100 = JSBI.BigInt(100)
export const _997 = JSBI.BigInt(997)
export const _1000 = JSBI.BigInt(1000)
export const FEES_NUMERATOR = JSBI.BigInt(9975)
export const FEES_DENOMINATOR = JSBI.BigInt(10000)

export enum SolidityType {
  uint8 = 'uint8',
  uint256 = 'uint256',
}

export const SOLIDITY_TYPE_MAXIMA = {
  [SolidityType.uint8]: JSBI.BigInt('0xff'),
  [SolidityType.uint256]: JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'),
}

// ============ TYPES ============

export type BigintIsh = JSBI | number | string

// ============ UTILITIES ============

export function validateAndParseAddress(address: string): string {
  try {
    const checksummedAddress = getAddress(address)
    return checksummedAddress
  } catch {
    throw new Error(`${address} is not a valid address.`)
  }
}

export function parseBigintIsh(bigintIsh: BigintIsh): JSBI {
  return bigintIsh instanceof JSBI ? bigintIsh : JSBI.BigInt(bigintIsh)
}

function sqrt(y: JSBI): JSBI {
  if (JSBI.greaterThan(y, THREE)) {
    let z = y
    let x = JSBI.add(JSBI.divide(y, TWO), ONE)
    while (JSBI.lessThan(x, z)) {
      z = x
      x = JSBI.divide(JSBI.add(JSBI.divide(y, x), x), TWO)
    }
    return z
  } else if (JSBI.notEqual(y, ZERO)) {
    return ONE
  } else {
    return ZERO
  }
}

export function sortedInsert<T>(items: T[], add: T, maxSize: number, comparator: (a: T, b: T) => number): T | null {
  if (maxSize <= 0) throw new Error('MAX_SIZE_ZERO')
  if (items.length > maxSize) throw new Error('ITEMS_SIZE')

  const isFull = items.length === maxSize
  if (isFull && comparator(items[items.length - 1], add) <= 0) {
    return add
  }

  let lo = 0
  let hi = items.length

  while (lo < hi) {
    const mid = (lo + hi) >>> 1
    if (comparator(items[mid], add) <= 0) {
      lo = mid + 1
    } else {
      hi = mid
    }
  }
  items.splice(lo, 0, add)
  return isFull ? items.pop()! : null
}


// ============ FRACTION ============

export class Fraction {
  public readonly numerator: JSBI
  public readonly denominator: JSBI

  constructor(numerator: BigintIsh, denominator: BigintIsh = ONE) {
    this.numerator = parseBigintIsh(numerator)
    this.denominator = parseBigintIsh(denominator)
  }

  get quotient(): JSBI {
    return JSBI.divide(this.numerator, this.denominator)
  }

  get remainder(): Fraction {
    return new Fraction(JSBI.remainder(this.numerator, this.denominator), this.denominator)
  }

  invert(): Fraction {
    return new Fraction(this.denominator, this.numerator)
  }

  add(other: Fraction | BigintIsh): Fraction {
    const otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other))
    if (JSBI.equal(this.denominator, otherParsed.denominator)) {
      return new Fraction(JSBI.add(this.numerator, otherParsed.numerator), this.denominator)
    }
    return new Fraction(
      JSBI.add(
        JSBI.multiply(this.numerator, otherParsed.denominator),
        JSBI.multiply(otherParsed.numerator, this.denominator)
      ),
      JSBI.multiply(this.denominator, otherParsed.denominator)
    )
  }

  subtract(other: Fraction | BigintIsh): Fraction {
    const otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other))
    if (JSBI.equal(this.denominator, otherParsed.denominator)) {
      return new Fraction(JSBI.subtract(this.numerator, otherParsed.numerator), this.denominator)
    }
    return new Fraction(
      JSBI.subtract(
        JSBI.multiply(this.numerator, otherParsed.denominator),
        JSBI.multiply(otherParsed.numerator, this.denominator)
      ),
      JSBI.multiply(this.denominator, otherParsed.denominator)
    )
  }

  lessThan(other: Fraction | BigintIsh): boolean {
    const otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other))
    return JSBI.lessThan(
      JSBI.multiply(this.numerator, otherParsed.denominator),
      JSBI.multiply(otherParsed.numerator, this.denominator)
    )
  }

  equalTo(other: Fraction | BigintIsh): boolean {
    const otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other))
    return JSBI.equal(
      JSBI.multiply(this.numerator, otherParsed.denominator),
      JSBI.multiply(otherParsed.numerator, this.denominator)
    )
  }

  greaterThan(other: Fraction | BigintIsh): boolean {
    const otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other))
    return JSBI.greaterThan(
      JSBI.multiply(this.numerator, otherParsed.denominator),
      JSBI.multiply(otherParsed.numerator, this.denominator)
    )
  }

  multiply(other: Fraction | BigintIsh): Fraction {
    const otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other))
    return new Fraction(
      JSBI.multiply(this.numerator, otherParsed.numerator),
      JSBI.multiply(this.denominator, otherParsed.denominator)
    )
  }

  divide(other: Fraction | BigintIsh): Fraction {
    const otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other))
    return new Fraction(
      JSBI.multiply(this.numerator, otherParsed.denominator),
      JSBI.multiply(this.denominator, otherParsed.numerator)
    )
  }

  toSignificant(
    significantDigits: number,
    format: object = { groupSeparator: '' },
    rounding: Rounding = Rounding.ROUND_HALF_UP
  ): string {
    const quotient = this.numerator.toString()
    return quotient
  }

  toFixed(
    decimalPlaces: number,
    format: object = { groupSeparator: '' },
    rounding: Rounding = Rounding.ROUND_HALF_UP
  ): string {
    return (Number(this.numerator.toString()) / Number(this.denominator.toString())).toFixed(decimalPlaces)
  }
}

// ============ PERCENT ============

const _100_PERCENT = new Fraction(_100)

export class Percent extends Fraction {
  toSignificant(significantDigits: number = 5, format?: object, rounding?: Rounding): string {
    return this.multiply(_100_PERCENT).toSignificant(significantDigits, format, rounding)
  }

  toFixed(decimalPlaces: number = 2, format?: object, rounding?: Rounding): string {
    return this.multiply(_100_PERCENT).toFixed(decimalPlaces, format, rounding)
  }
}


// ============ CURRENCY ============

export class Currency {
  public readonly decimals: number
  public readonly symbol?: string
  public readonly name?: string

  public static readonly ETHER: Currency = new Currency(18, 'MON', 'Monad')

  protected constructor(decimals: number, symbol?: string, name?: string) {
    this.decimals = decimals
    this.symbol = symbol
    this.name = name
  }
}

export const ETHER = Currency.ETHER

// ============ TOKEN ============

export class Token extends Currency {
  public readonly chainId: ChainId | number
  public readonly address: string

  constructor(chainId: ChainId | number, address: string, decimals: number, symbol?: string, name?: string) {
    super(decimals, symbol, name)
    this.chainId = chainId
    this.address = validateAndParseAddress(address)
  }

  equals(other: Token): boolean {
    if (this === other) return true
    return this.chainId === other.chainId && this.address === other.address
  }

  sortsBefore(other: Token): boolean {
    if (this.chainId !== other.chainId) throw new Error('CHAIN_IDS')
    if (this.address === other.address) throw new Error('ADDRESSES')
    return this.address.toLowerCase() < other.address.toLowerCase()
  }
}

// ============ WETH / WMON ============

export const WETH: { [chainId: number]: Token } = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    18,
    'WBNB',
    'Wrapped BNB'
  ),
  [ChainId.TESTNET]: new Token(
    ChainId.TESTNET,
    '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
    18,
    'WBNB',
    'Wrapped BNB'
  ),
  [ChainId.MONAD]: new Token(
    ChainId.MONAD,
    '0xFfDFF1bAb47d8e6D1Da119F5C925fAC91FAfA899',
    18,
    'WMON',
    'Wrapped MON'
  ),
}

// Alias for Monad
export const WMON = WETH[ChainId.MONAD]

// ============ CURRENCY AMOUNT ============

export class CurrencyAmount extends Fraction {
  public readonly currency: Currency

  protected constructor(currency: Currency, amount: BigintIsh) {
    const parsedAmount = parseBigintIsh(amount)
    super(parsedAmount, JSBI.exponentiate(TEN, JSBI.BigInt(currency.decimals)))
    this.currency = currency
  }

  public get raw(): JSBI {
    return this.numerator
  }

  public add(other: CurrencyAmount): CurrencyAmount {
    if (this.currency !== other.currency) throw new Error('CURRENCY')
    return new CurrencyAmount(this.currency, JSBI.add(this.raw, other.raw))
  }

  public subtract(other: CurrencyAmount): CurrencyAmount {
    if (this.currency !== other.currency) throw new Error('CURRENCY')
    return new CurrencyAmount(this.currency, JSBI.subtract(this.raw, other.raw))
  }

  public static ether(amount: BigintIsh): CurrencyAmount {
    return new CurrencyAmount(ETHER, amount)
  }
}

// ============ TOKEN AMOUNT ============

export class TokenAmount extends CurrencyAmount {
  public readonly token: Token

  constructor(token: Token, amount: BigintIsh) {
    super(token, amount)
    this.token = token
  }

  public add(other: TokenAmount): TokenAmount {
    if (!this.token.equals(other.token)) throw new Error('TOKEN')
    return new TokenAmount(this.token, JSBI.add(this.raw, other.raw))
  }

  public subtract(other: TokenAmount): TokenAmount {
    if (!this.token.equals(other.token)) throw new Error('TOKEN')
    return new TokenAmount(this.token, JSBI.subtract(this.raw, other.raw))
  }
}


// ============ PRICE ============

export class Price extends Fraction {
  public readonly baseCurrency: Currency
  public readonly quoteCurrency: Currency
  public readonly scalar: Fraction

  constructor(baseCurrency: Currency, quoteCurrency: Currency, denominator: BigintIsh, numerator: BigintIsh) {
    super(numerator, denominator)
    this.baseCurrency = baseCurrency
    this.quoteCurrency = quoteCurrency
    this.scalar = new Fraction(
      JSBI.exponentiate(TEN, JSBI.BigInt(baseCurrency.decimals)),
      JSBI.exponentiate(TEN, JSBI.BigInt(quoteCurrency.decimals))
    )
  }

  get raw(): Fraction {
    return new Fraction(this.numerator, this.denominator)
  }

  get adjusted(): Fraction {
    return super.multiply(this.scalar)
  }

  invert(): Price {
    return new Price(this.quoteCurrency, this.baseCurrency, this.numerator, this.denominator)
  }

  multiply(other: Price): Price {
    if (this.quoteCurrency !== other.baseCurrency) throw new Error('TOKEN')
    const fraction = super.multiply(other)
    return new Price(this.baseCurrency, other.quoteCurrency, fraction.denominator, fraction.numerator)
  }

  quote(currencyAmount: CurrencyAmount): CurrencyAmount {
    if (currencyAmount.currency !== this.baseCurrency) throw new Error('TOKEN')
    return new CurrencyAmount(
      this.quoteCurrency,
      JSBI.divide(JSBI.multiply(currencyAmount.raw, this.numerator), this.denominator)
    )
  }

  toSignificant(significantDigits: number = 6, format?: object, rounding?: Rounding): string {
    return this.adjusted.toSignificant(significantDigits, format, rounding)
  }

  toFixed(decimalPlaces: number = 4, format?: object, rounding?: Rounding): string {
    return this.adjusted.toFixed(decimalPlaces, format, rounding)
  }
}

// ============ PAIR ============

let PAIR_ADDRESS_CACHE: { [key: string]: string } = {}

export class Pair {
  public readonly liquidityToken: Token
  private readonly tokenAmounts: [TokenAmount, TokenAmount]

  static getAddress(tokenA: Token, tokenB: Token): string {
    const tokens = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
    const key = `${tokens[0].chainId}-${tokens[0].address}-${tokens[1].address}`

    if (PAIR_ADDRESS_CACHE[key] === undefined) {
      PAIR_ADDRESS_CACHE[key] = getCreate2Address(
        FACTORY_ADDRESS_MAP[tokens[0].chainId] || FACTORY_ADDRESS,
        keccak256(['bytes'], [pack(['address', 'address'], [tokens[0].address, tokens[1].address])]),
        INIT_CODE_HASH_MAP[tokens[0].chainId] || INIT_CODE_HASH
      )
    }
    return PAIR_ADDRESS_CACHE[key]
  }

  constructor(tokenAmountA: TokenAmount, tokenAmountB: TokenAmount) {
    const tokenAmounts = tokenAmountA.token.sortsBefore(tokenAmountB.token)
      ? [tokenAmountA, tokenAmountB]
      : [tokenAmountB, tokenAmountA]
    this.liquidityToken = new Token(
      tokenAmounts[0].token.chainId,
      Pair.getAddress(tokenAmounts[0].token, tokenAmounts[1].token),
      18,
      'MLP',
      'MemeSwap LP'
    )
    this.tokenAmounts = tokenAmounts as [TokenAmount, TokenAmount]
  }

  get chainId(): ChainId | number {
    return this.token0.chainId
  }

  get token0(): Token {
    return this.tokenAmounts[0].token
  }

  get token1(): Token {
    return this.tokenAmounts[1].token
  }

  get reserve0(): TokenAmount {
    return this.tokenAmounts[0]
  }

  get reserve1(): TokenAmount {
    return this.tokenAmounts[1]
  }

  reserveOf(token: Token): TokenAmount {
    if (token.equals(this.token0)) return this.reserve0
    if (token.equals(this.token1)) return this.reserve1
    throw new Error('TOKEN')
  }

  getOutputAmount(inputAmount: TokenAmount): [TokenAmount, Pair] {
    if (!this.involvesToken(inputAmount.token)) throw new Error('TOKEN')
    if (JSBI.equal(this.reserve0.raw, ZERO) || JSBI.equal(this.reserve1.raw, ZERO)) {
      throw new Error('INSUFFICIENT_RESERVES')
    }
    const inputReserve = this.reserveOf(inputAmount.token)
    const outputReserve = this.reserveOf(inputAmount.token.equals(this.token0) ? this.token1 : this.token0)
    const inputAmountWithFee = JSBI.multiply(inputAmount.raw, FEES_NUMERATOR)
    const numerator = JSBI.multiply(inputAmountWithFee, outputReserve.raw)
    const denominator = JSBI.add(JSBI.multiply(inputReserve.raw, FEES_DENOMINATOR), inputAmountWithFee)
    const outputAmount = new TokenAmount(
      inputAmount.token.equals(this.token0) ? this.token1 : this.token0,
      JSBI.divide(numerator, denominator)
    )
    if (JSBI.equal(outputAmount.raw, ZERO)) {
      throw new Error('INSUFFICIENT_INPUT_AMOUNT')
    }
    return [
      outputAmount,
      new Pair(inputReserve.add(inputAmount), outputReserve.subtract(outputAmount)),
    ]
  }

  getInputAmount(outputAmount: TokenAmount): [TokenAmount, Pair] {
    if (!this.involvesToken(outputAmount.token)) throw new Error('TOKEN')
    if (
      JSBI.equal(this.reserve0.raw, ZERO) ||
      JSBI.equal(this.reserve1.raw, ZERO) ||
      JSBI.greaterThanOrEqual(outputAmount.raw, this.reserveOf(outputAmount.token).raw)
    ) {
      throw new Error('INSUFFICIENT_RESERVES')
    }
    const outputReserve = this.reserveOf(outputAmount.token)
    const inputReserve = this.reserveOf(outputAmount.token.equals(this.token0) ? this.token1 : this.token0)
    const numerator = JSBI.multiply(JSBI.multiply(inputReserve.raw, outputAmount.raw), FEES_DENOMINATOR)
    const denominator = JSBI.multiply(JSBI.subtract(outputReserve.raw, outputAmount.raw), FEES_NUMERATOR)
    const inputAmount = new TokenAmount(
      outputAmount.token.equals(this.token0) ? this.token1 : this.token0,
      JSBI.add(JSBI.divide(numerator, denominator), ONE)
    )
    return [inputAmount, new Pair(inputReserve.add(inputAmount), outputReserve.subtract(outputAmount))]
  }

  getLiquidityMinted(
    totalSupply: TokenAmount,
    tokenAmountA: TokenAmount,
    tokenAmountB: TokenAmount
  ): TokenAmount {
    if (!totalSupply.token.equals(this.liquidityToken)) throw new Error('LIQUIDITY')
    const tokenAmounts = tokenAmountA.token.sortsBefore(tokenAmountB.token)
      ? [tokenAmountA, tokenAmountB]
      : [tokenAmountB, tokenAmountA]
    if (!tokenAmounts[0].token.equals(this.token0) || !tokenAmounts[1].token.equals(this.token1)) {
      throw new Error('TOKEN')
    }

    let liquidity: JSBI
    if (JSBI.equal(totalSupply.raw, ZERO)) {
      liquidity = JSBI.subtract(sqrt(JSBI.multiply(tokenAmounts[0].raw, tokenAmounts[1].raw)), MINIMUM_LIQUIDITY)
    } else {
      const amount0 = JSBI.divide(JSBI.multiply(tokenAmounts[0].raw, totalSupply.raw), this.reserve0.raw)
      const amount1 = JSBI.divide(JSBI.multiply(tokenAmounts[1].raw, totalSupply.raw), this.reserve1.raw)
      liquidity = JSBI.lessThanOrEqual(amount0, amount1) ? amount0 : amount1
    }
    if (!JSBI.greaterThan(liquidity, ZERO)) {
      throw new Error('INSUFFICIENT_INPUT_AMOUNT')
    }
    return new TokenAmount(this.liquidityToken, liquidity)
  }

  getLiquidityValue(
    token: Token,
    totalSupply: TokenAmount,
    liquidity: TokenAmount,
    feeOn: boolean = false,
    kLast?: BigintIsh
  ): TokenAmount {
    if (!totalSupply.token.equals(this.liquidityToken)) throw new Error('TOTAL_SUPPLY')
    if (!liquidity.token.equals(this.liquidityToken)) throw new Error('LIQUIDITY')
    if (JSBI.greaterThan(liquidity.raw, totalSupply.raw)) throw new Error('LIQUIDITY')

    let totalSupplyAdjusted: TokenAmount
    if (!feeOn) {
      totalSupplyAdjusted = totalSupply
    } else {
      if (!kLast) throw new Error('K_LAST')
      const kLastParsed = parseBigintIsh(kLast)
      if (!JSBI.equal(kLastParsed, ZERO)) {
        const rootK = sqrt(JSBI.multiply(this.reserve0.raw, this.reserve1.raw))
        const rootKLast = sqrt(kLastParsed)
        if (JSBI.greaterThan(rootK, rootKLast)) {
          const numerator = JSBI.multiply(totalSupply.raw, JSBI.subtract(rootK, rootKLast))
          const denominator = JSBI.add(JSBI.multiply(rootK, FIVE), rootKLast)
          const feeLiquidity = JSBI.divide(numerator, denominator)
          totalSupplyAdjusted = totalSupply.add(new TokenAmount(this.liquidityToken, feeLiquidity))
        } else {
          totalSupplyAdjusted = totalSupply
        }
      } else {
        totalSupplyAdjusted = totalSupply
      }
    }

    return new TokenAmount(
      token,
      JSBI.divide(JSBI.multiply(liquidity.raw, this.reserveOf(token).raw), totalSupplyAdjusted.raw)
    )
  }

  involvesToken(token: Token): boolean {
    return token.equals(this.token0) || token.equals(this.token1)
  }

  get priceOf(): (token: Token) => Price {
    return (token: Token) => this.priceOfToken(token)
  }

  priceOfToken(token: Token): Price {
    if (!this.involvesToken(token)) throw new Error('TOKEN')
    return token.equals(this.token0)
      ? new Price(this.token0, this.token1, this.reserve0.raw, this.reserve1.raw)
      : new Price(this.token1, this.token0, this.reserve1.raw, this.reserve0.raw)
  }
}


// ============ ROUTE ============

export class Route {
  public readonly pairs: Pair[]
  public readonly path: Token[]
  public readonly input: Currency
  public readonly output: Currency
  public readonly midPrice: Price

  constructor(pairs: Pair[], input: Currency, output?: Currency) {
    if (pairs.length === 0) throw new Error('PAIRS')
    if (
      pairs.every((pair) => pair.chainId !== (input instanceof Token ? input.chainId : ChainId.MONAD))
    ) {
      throw new Error('CHAIN_IDS')
    }

    const path: Token[] = [input instanceof Token ? input : WETH[ChainId.MONAD]]
    for (const [i, pair] of pairs.entries()) {
      const currentInput = path[i]
      if (!currentInput.equals(pair.token0) && !currentInput.equals(pair.token1)) throw new Error('PATH')
      const output = currentInput.equals(pair.token0) ? pair.token1 : pair.token0
      path.push(output)
    }

    this.pairs = pairs
    this.path = path
    this.midPrice = Price.fromRoute(this)
    this.input = input
    this.output = output ?? path[path.length - 1]
  }

  get chainId(): ChainId | number {
    return this.pairs[0].chainId
  }
}

// Static method for Price
Price.fromRoute = function (route: Route): Price {
  const prices: Price[] = []
  for (const [i, pair] of route.pairs.entries()) {
    prices.push(
      route.path[i].equals(pair.token0)
        ? new Price(pair.reserve0.currency, pair.reserve1.currency, pair.reserve0.raw, pair.reserve1.raw)
        : new Price(pair.reserve1.currency, pair.reserve0.currency, pair.reserve1.raw, pair.reserve0.raw)
    )
  }
  return prices.slice(1).reduce((accumulator, currentValue) => accumulator.multiply(currentValue), prices[0])
}

// ============ TRADE ============

function inputOutputComparator(a: Trade, b: Trade): number {
  if (!a.outputAmount.currency.equals(b.outputAmount.currency)) throw new Error('OUTPUT_CURRENCY')
  if (!a.inputAmount.currency.equals(b.inputAmount.currency)) throw new Error('INPUT_CURRENCY')
  if (a.outputAmount.equalTo(b.outputAmount)) {
    if (a.inputAmount.equalTo(b.inputAmount)) {
      return 0
    }
    if (a.inputAmount.lessThan(b.inputAmount)) {
      return -1
    } else {
      return 1
    }
  } else {
    if (a.outputAmount.lessThan(b.outputAmount)) {
      return 1
    } else {
      return -1
    }
  }
}

function tradeComparator(a: Trade, b: Trade): number {
  const ioComp = inputOutputComparator(a, b)
  if (ioComp !== 0) {
    return ioComp
  }
  if (a.priceImpact.lessThan(b.priceImpact)) {
    return -1
  } else if (a.priceImpact.greaterThan(b.priceImpact)) {
    return 1
  }
  return a.route.path.length - b.route.path.length
}

export interface BestTradeOptions {
  maxNumResults?: number
  maxHops?: number
}

export class Trade {
  public readonly route: Route
  public readonly tradeType: TradeType
  public readonly inputAmount: CurrencyAmount
  public readonly outputAmount: CurrencyAmount
  public readonly executionPrice: Price
  public readonly nextMidPrice: Price
  public readonly priceImpact: Percent

  constructor(route: Route, amount: CurrencyAmount, tradeType: TradeType) {
    const amounts: TokenAmount[] = new Array(route.path.length)
    const nextPairs: Pair[] = new Array(route.pairs.length)
    if (tradeType === TradeType.EXACT_INPUT) {
      if (amount.currency !== route.input) throw new Error('INPUT')
      amounts[0] = amount instanceof TokenAmount ? amount : new TokenAmount(WETH[route.chainId], amount.raw)
      for (let i = 0; i < route.path.length - 1; i++) {
        const pair = route.pairs[i]
        const [outputAmount, nextPair] = pair.getOutputAmount(amounts[i])
        amounts[i + 1] = outputAmount
        nextPairs[i] = nextPair
      }
    } else {
      if (amount.currency !== route.output) throw new Error('OUTPUT')
      amounts[amounts.length - 1] =
        amount instanceof TokenAmount ? amount : new TokenAmount(WETH[route.chainId], amount.raw)
      for (let i = route.path.length - 1; i > 0; i--) {
        const pair = route.pairs[i - 1]
        const [inputAmount, nextPair] = pair.getInputAmount(amounts[i])
        amounts[i - 1] = inputAmount
        nextPairs[i - 1] = nextPair
      }
    }

    this.route = route
    this.tradeType = tradeType
    this.inputAmount =
      tradeType === TradeType.EXACT_INPUT
        ? amount
        : route.input === ETHER
        ? CurrencyAmount.ether(amounts[0].raw)
        : amounts[0]
    this.outputAmount =
      tradeType === TradeType.EXACT_OUTPUT
        ? amount
        : route.output === ETHER
        ? CurrencyAmount.ether(amounts[amounts.length - 1].raw)
        : amounts[amounts.length - 1]
    this.executionPrice = new Price(
      this.inputAmount.currency,
      this.outputAmount.currency,
      this.inputAmount.raw,
      this.outputAmount.raw
    )
    this.nextMidPrice = Price.fromRoute(new Route(nextPairs, route.input))
    this.priceImpact = computePriceImpact(route.midPrice, this.inputAmount, this.outputAmount)
  }

  minimumAmountOut(slippageTolerance: Percent): CurrencyAmount {
    if (this.tradeType === TradeType.EXACT_OUTPUT) {
      return this.outputAmount
    } else {
      const slippageAdjustedAmountOut = new Fraction(ONE)
        .add(slippageTolerance)
        .invert()
        .multiply(this.outputAmount.raw).quotient
      return this.outputAmount instanceof TokenAmount
        ? new TokenAmount(this.outputAmount.token, slippageAdjustedAmountOut)
        : CurrencyAmount.ether(slippageAdjustedAmountOut)
    }
  }

  maximumAmountIn(slippageTolerance: Percent): CurrencyAmount {
    if (this.tradeType === TradeType.EXACT_INPUT) {
      return this.inputAmount
    } else {
      const slippageAdjustedAmountIn = new Fraction(ONE)
        .add(slippageTolerance)
        .multiply(this.inputAmount.raw).quotient
      return this.inputAmount instanceof TokenAmount
        ? new TokenAmount(this.inputAmount.token, slippageAdjustedAmountIn)
        : CurrencyAmount.ether(slippageAdjustedAmountIn)
    }
  }

  static bestTradeExactIn(
    pairs: Pair[],
    currencyAmountIn: CurrencyAmount,
    currencyOut: Currency,
    { maxNumResults = 3, maxHops = 3 }: BestTradeOptions = {},
    currentPairs: Pair[] = [],
    originalAmountIn: CurrencyAmount = currencyAmountIn,
    bestTrades: Trade[] = []
  ): Trade[] {
    if (pairs.length === 0) throw new Error('PAIRS')
    if (maxHops <= 0) throw new Error('MAX_HOPS')
    if (!(currencyAmountIn instanceof TokenAmount) && currencyAmountIn.currency !== ETHER) throw new Error('INPUT')
    if (currencyOut === undefined) throw new Error('OUTPUT')

    const amountIn =
      currencyAmountIn instanceof TokenAmount ? currencyAmountIn : new TokenAmount(WETH[ChainId.MONAD], currencyAmountIn.raw)
    const tokenOut = currencyOut instanceof Token ? currencyOut : WETH[ChainId.MONAD]

    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i]
      if (!pair.token0.equals(amountIn.token) && !pair.token1.equals(amountIn.token)) continue
      if (pair.reserve0.equalTo(ZERO) || pair.reserve1.equalTo(ZERO)) continue

      let amountOut: TokenAmount
      try {
        ;[amountOut] = pair.getOutputAmount(amountIn)
      } catch (error: any) {
        if (error.message === 'INSUFFICIENT_INPUT_AMOUNT') continue
        throw error
      }

      if (amountOut.token.equals(tokenOut)) {
        sortedInsert(
          bestTrades,
          new Trade(
            new Route([...currentPairs, pair], originalAmountIn.currency, currencyOut),
            originalAmountIn,
            TradeType.EXACT_INPUT
          ),
          maxNumResults,
          tradeComparator
        )
      } else if (maxHops > 1 && pairs.length > 1) {
        const pairsExcludingThisPair = pairs.slice(0, i).concat(pairs.slice(i + 1, pairs.length))
        Trade.bestTradeExactIn(
          pairsExcludingThisPair,
          amountOut,
          currencyOut,
          { maxNumResults, maxHops: maxHops - 1 },
          [...currentPairs, pair],
          originalAmountIn,
          bestTrades
        )
      }
    }
    return bestTrades
  }

  static bestTradeExactOut(
    pairs: Pair[],
    currencyIn: Currency,
    currencyAmountOut: CurrencyAmount,
    { maxNumResults = 3, maxHops = 3 }: BestTradeOptions = {},
    currentPairs: Pair[] = [],
    originalAmountOut: CurrencyAmount = currencyAmountOut,
    bestTrades: Trade[] = []
  ): Trade[] {
    if (pairs.length === 0) throw new Error('PAIRS')
    if (maxHops <= 0) throw new Error('MAX_HOPS')
    if (!(currencyAmountOut instanceof TokenAmount) && currencyAmountOut.currency !== ETHER) throw new Error('OUTPUT')
    if (currencyIn === undefined) throw new Error('INPUT')

    const amountOut =
      currencyAmountOut instanceof TokenAmount ? currencyAmountOut : new TokenAmount(WETH[ChainId.MONAD], currencyAmountOut.raw)
    const tokenIn = currencyIn instanceof Token ? currencyIn : WETH[ChainId.MONAD]

    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i]
      if (!pair.token0.equals(amountOut.token) && !pair.token1.equals(amountOut.token)) continue
      if (pair.reserve0.equalTo(ZERO) || pair.reserve1.equalTo(ZERO)) continue

      let amountIn: TokenAmount
      try {
        ;[amountIn] = pair.getInputAmount(amountOut)
      } catch (error: any) {
        if (error.message === 'INSUFFICIENT_RESERVES' || error.message === 'INSUFFICIENT_INPUT_AMOUNT') continue
        throw error
      }

      if (amountIn.token.equals(tokenIn)) {
        sortedInsert(
          bestTrades,
          new Trade(
            new Route([pair, ...currentPairs], currencyIn, originalAmountOut.currency),
            originalAmountOut,
            TradeType.EXACT_OUTPUT
          ),
          maxNumResults,
          tradeComparator
        )
      } else if (maxHops > 1 && pairs.length > 1) {
        const pairsExcludingThisPair = pairs.slice(0, i).concat(pairs.slice(i + 1, pairs.length))
        Trade.bestTradeExactOut(
          pairsExcludingThisPair,
          currencyIn,
          amountIn,
          { maxNumResults, maxHops: maxHops - 1 },
          [pair, ...currentPairs],
          originalAmountOut,
          bestTrades
        )
      }
    }
    return bestTrades
  }
}

function computePriceImpact(midPrice: Price, inputAmount: CurrencyAmount, outputAmount: CurrencyAmount): Percent {
  const exactQuote = midPrice.raw.multiply(inputAmount.raw)
  const slippage = exactQuote.subtract(outputAmount.raw).divide(exactQuote)
  return new Percent(slippage.numerator, slippage.denominator)
}

// ============ ROUTER ============

export abstract class Router {
  static swapCallParameters(trade: Trade, options: any): { methodName: string; args: any[]; value: string } {
    // Simplified router parameters
    const etherIn = trade.inputAmount.currency === ETHER
    const etherOut = trade.outputAmount.currency === ETHER
    
    if (etherIn) {
      return {
        methodName: trade.tradeType === TradeType.EXACT_INPUT 
          ? 'swapExactETHForTokens' 
          : 'swapETHForExactTokens',
        args: [],
        value: trade.inputAmount.raw.toString(),
      }
    } else if (etherOut) {
      return {
        methodName: trade.tradeType === TradeType.EXACT_INPUT 
          ? 'swapExactTokensForETH' 
          : 'swapTokensForExactETH',
        args: [],
        value: '0x0',
      }
    } else {
      return {
        methodName: trade.tradeType === TradeType.EXACT_INPUT 
          ? 'swapExactTokensForTokens' 
          : 'swapTokensForExactTokens',
        args: [],
        value: '0x0',
      }
    }
  }
}

// ============ FETCHER ============

export abstract class Fetcher {
  static async fetchTokenData(
    chainId: ChainId,
    address: string,
    provider?: any,
    symbol?: string,
    name?: string
  ): Promise<Token> {
    return new Token(chainId, address, 18, symbol, name)
  }

  static async fetchPairData(
    tokenA: Token,
    tokenB: Token,
    provider?: any
  ): Promise<Pair> {
    // Return empty pair - actual implementation would fetch from chain
    return new Pair(
      new TokenAmount(tokenA, ZERO),
      new TokenAmount(tokenB, ZERO)
    )
  }
}

// ============ UTILITY FUNCTIONS ============

export function currencyEquals(currencyA: Currency, currencyB: Currency): boolean {
  if (currencyA instanceof Token && currencyB instanceof Token) {
    return currencyA.equals(currencyB)
  } else if (currencyA instanceof Token) {
    return false
  } else if (currencyB instanceof Token) {
    return false
  } else {
    return currencyA === currencyB
  }
}

export function wrappedCurrency(currency: Currency | undefined, chainId: ChainId | undefined): Token | undefined {
  return chainId && currency === ETHER ? WETH[chainId] : currency instanceof Token ? currency : undefined
}

export function wrappedCurrencyAmount(
  currencyAmount: CurrencyAmount | undefined,
  chainId: ChainId | undefined
): TokenAmount | undefined {
  const token = currencyAmount && chainId ? wrappedCurrency(currencyAmount.currency, chainId) : undefined
  return token && currencyAmount ? new TokenAmount(token, currencyAmount.raw) : undefined
}

// ============ RE-EXPORTS ============

export { JSBI }
