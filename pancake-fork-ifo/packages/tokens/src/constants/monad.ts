import { ChainId } from '@pancakeswap/chains'
import { ERC20Token, WETH9 } from '@pancakeswap/sdk'

export const monadTokens = {
  wmon: WETH9[ChainId.MONAD],
  // MON here points to the WMON contract. Wherever the currency MON is required, conditional checks for the symbol 'MON' can be used
  mon: new ERC20Token(
    ChainId.MONAD,
    '0xFfDFF1bAb47d8e6D1Da119F5C925fAC91FAfA899',
    18,
    'MON',
    'Monad',
    'https://monad.xyz/',
  ),
  mmf: new ERC20Token(
    ChainId.MONAD,
    '0x28dD3002Ca0040eAc4037759c9b372Ca66051af6',
    18,
    'MMF',
    'Meme Finance',
    'https://meme.finance/',
  ),
  // Using WMON as placeholder for missing stablecoins
  usdt: new ERC20Token(
    ChainId.MONAD,
    '0xFfDFF1bAb47d8e6D1Da119F5C925fAC91FAfA899',
    18,
    'USDT',
    'Tether USD (Placeholder)',
    'https://tether.to/',
  ),
  usdc: new ERC20Token(
    ChainId.MONAD,
    '0xFfDFF1bAb47d8e6D1Da119F5C925fAC91FAfA899',
    18,
    'USDC',
    'USD Coin (Placeholder)',
    'https://www.centre.io/usdc',
  ),
  busd: new ERC20Token(
    ChainId.MONAD,
    '0xFfDFF1bAb47d8e6D1Da119F5C925fAC91FAfA899',
    18,
    'BUSD',
    'Binance USD (Placeholder)',
    'https://www.paxos.com/busd/',
  ),
  syrup: new ERC20Token(
    ChainId.MONAD,
    '0x0FfCe1fDD4ae2A296D8229784797f8fE4A7C9ac0',
    18,
    'SYRUP',
    'SyrupBar Token',
    'https://pancakeswap.finance/',
  ),
}