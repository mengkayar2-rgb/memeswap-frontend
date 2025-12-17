import { BigNumber } from '@ethersproject/bignumber'
import Trans from 'components/Trans'
import { VaultKey } from 'state/types'
import { ChainId } from '@memeswap/sdk'
import { CHAIN_ID } from './networks'
import tokens, { serializeTokens } from './tokens'
import { SerializedPoolConfig, PoolCategory } from './types'
const chainId = parseInt(CHAIN_ID, 10)
const { MAINNET } = ChainId

const serializedTokens = serializeTokens()

export const MAX_LOCK_DURATION = 31536000
export const UNLOCK_FREE_DURATION = 604800
export const ONE_WEEK_DEFAULT = 604800
export const BOOST_WEIGHT = BigNumber.from('10000000000000')
export const DURATION_FACTOR = BigNumber.from('31536000')

export const vaultPoolConfig = {
  [VaultKey.CakeVaultV1]: {
    name: <Trans>Auto WAG</Trans>,
    description: <Trans>Automatic restaking</Trans>,
    autoCompoundFrequency: 5000,
    gasLimit: 1000000,
    tokenImage: {
      primarySrc: `/images/toggle/wagyu.png`,
      secondarySrc: '/images/tokens/autorenew.svg',
    },
  },
  [VaultKey.CakeVault]: {
    name: <Trans>Stake WAG</Trans>,
    description: <Trans>Stake, Earn – And more!</Trans>,
    autoCompoundFrequency: 5000,
    gasLimit: 1000000,
    tokenImage: {
      primarySrc: `/images/toggle/wagyu.png`,
      secondarySrc: '/images/tokens/autorenew.svg',
    },
  },
} as const

// Monad chainId
const MONAD = 143

// Monad pools - empty for now (pools disabled)
const monadPools: SerializedPoolConfig[] = []

const pools: SerializedPoolConfig[] =
  chainId === MONAD
    ? monadPools
    : chainId === MAINNET
    ? [
        {
          sousId: 0,
          stakingToken: serializedTokens.cake,
          earningToken: serializedTokens.cake,
          contractAddress: {
            111: '',
            106: '0xa7e8280b8CE4f87dFeFc3d1F2254B5CCD971E852',
          },
          poolCategory: PoolCategory.CORE,
          harvest: true,
          tokenPerBlock: '3.25',
          sortOrder: 1,
          isFinished: false,
        },
        {
          sousId: 2,
          stakingToken: serializedTokens.cake,
          earningToken: serializedTokens.scar,
          contractAddress: {
            111: '',
            106: '0x9907B73574245fF0e538C49088B522b5f004FDEf',
          },
          poolCategory: PoolCategory.CORE,
          harvest: true,
          tokenPerBlock: '0.064',
          sortOrder: 2,
          isFinished: true,
        },
        {
          sousId: 3,
          stakingToken: serializedTokens.cake,
          earningToken: serializedTokens.astro,
          contractAddress: {
            111: '',
            106: '0xA0e9F28837325f5718AFE497e0B73fDDE99c3dA9',
          },
          poolCategory: PoolCategory.CORE,
          harvest: true,
          tokenPerBlock: '0.13',
          sortOrder: 3,
          isFinished: true,
        },
        {
          sousId: 4,
          stakingToken: serializedTokens.cake,
          earningToken: serializedTokens.swapz,
          contractAddress: {
            111: '',
            106: '0xd6E00EA52eb7bdb5E15A8445Ea7e25c70Dc763a4',
          },
          poolCategory: PoolCategory.CORE,
          harvest: true,
          tokenPerBlock: '0.1286',
          sortOrder: 4,
          isFinished: true,
        },
        {
          sousId: 5,
          stakingToken: serializedTokens.swapz,
          earningToken: serializedTokens.swapz,
          contractAddress: {
            111: '',
            106: '0x0b7c46E1f729972499a9Ab45D307101198Ab9BA9',
          },
          poolCategory: PoolCategory.CORE,
          harvest: true,
          tokenPerBlock: '0.239',
          sortOrder: 4,
          isFinished: true,
        },
        {
          sousId: 6,
          stakingToken: serializedTokens.cake,
          earningToken: serializedTokens.vdgt,
          contractAddress: {
            111: '',
            106: '0xbedeBB4c7D336E6E5e5B8685d33Fb3bbfebc4B6B',
          },
          poolCategory: PoolCategory.CORE,
          harvest: true,
          tokenPerBlock: '0.317',
          sortOrder: 5,
          isFinished: true,
          enableEmergencyWithdraw: true,
        },
        {
          sousId: 7,
          stakingToken: serializedTokens.cake,
          earningToken: serializedTokens.wvlx,
          contractAddress: {
            111: '',
            106: '0xe68a572CEc1C021d8a13DbDd0bDBCFEdc8F1901f',
          },
          poolCategory: PoolCategory.CORE,
          harvest: true,
          tokenPerBlock: '0.03145',
          sortOrder: 6,
          isFinished: true,
        },
        {
          sousId: 8,
          stakingToken: serializedTokens.cake,
          earningToken: serializedTokens.vlxpad,
          contractAddress: {
            111: '',
            106: '0x2ABe5242d36E3A0f643EF4748d35Bd8B7FC56C5d',
          },
          poolCategory: PoolCategory.CORE,
          harvest: true,
          tokenPerBlock: '0.0629',
          sortOrder: 7,
          isFinished: true,
        },
      ]
    : [
        {
          sousId: 0,
          stakingToken: serializedTokens.cake,
          earningToken: serializedTokens.cake,
          contractAddress: {
            111: '0xB10b783c4002965F9CEA0Df63F10118c3ED61704',
            106: '',
          },
          poolCategory: PoolCategory.CORE,
          harvest: true,
          tokenPerBlock: '1.3',
          sortOrder: 1,
          isFinished: false,
        },
        {
          sousId: 1,
          stakingToken: serializedTokens.te6,
          earningToken: serializedTokens.cake,
          contractAddress: {
            111: '0x6963bD4b2657Ef5D41AE3fC5853D104186fb8375',
            106: '',
          },
          poolCategory: PoolCategory.CORE,
          harvest: true,
          tokenPerBlock: '1',
          sortOrder: 1,
          isFinished: true,
        },
        {
          sousId: 2,
          stakingToken: serializedTokens.te9,
          earningToken: serializedTokens.cake,
          contractAddress: {
            111: '0xbbbbd1834E52555B124831a87B6C113a4900b45f',
            106: '',
          },
          poolCategory: PoolCategory.CORE,
          harvest: true,
          tokenPerBlock: '1',
          sortOrder: 1,
          isFinished: true,
        },
        {
          sousId: 3,
          stakingToken: serializedTokens.te12,
          earningToken: serializedTokens.cake,
          contractAddress: {
            111: '0x050A703e5fa220Bc86d0E29F694C1215D020745c',
            106: '',
          },
          poolCategory: PoolCategory.CORE,
          harvest: true,
          tokenPerBlock: '1',
          sortOrder: 1,
          isFinished: true,
        },
        {
          sousId: 4,
          stakingToken: serializedTokens.te18,
          earningToken: serializedTokens.cake,
          contractAddress: {
            111: '0x671C7efe0847A5E87d2b7Ffeb539d9383F638072',
            106: '',
          },
          poolCategory: PoolCategory.CORE,
          harvest: true,
          tokenPerBlock: '1',
          sortOrder: 1,
          isFinished: true,
        },
      ]
export default pools
