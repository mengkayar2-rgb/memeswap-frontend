import addresses from 'config/constants/addresses.json'
import { useCallback, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useFastRefreshEffect } from 'hooks/useRefreshEffect'
import { SerializedPool } from 'state/types'
import { transformPool } from 'state/pools/helpers'
import { getCakeContract } from 'utils/contractHelpers'
import { CHAIN_ID } from 'config/constants/networks'
import { PoolCategory } from 'config/constants/types'
import { serializeTokens } from 'config/constants/tokens'
import { fetchUserStakeBalances, fetchUserPendingRewards } from './fetchPoolsUser'

// Safe chainId with fallback
const safeChainId = (CHAIN_ID || '143') as '143' | '111' | '106'
export interface PoolsState {
  data: SerializedPool
  userDataLoaded: boolean
}

const serializedTokens = serializeTokens()
const cakeContract = getCakeContract()

const initialData = {
  data: {
    sousId: 0,
    stakingToken: serializedTokens.cake,
    earningToken: serializedTokens.cake,
    contractAddress: {
      143: addresses['143'].WAGFarmV1,
      111: addresses['111'].WAGFarmV1,
      106: addresses['106'].WAGFarmV1,
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '10',
    sortOrder: 1,
    isFinished: false,
    totalStaked: '0',
  },
  userDataLoaded: false,
}

export const useFetchUserPools = (account) => {
  const [userPoolsData, setPoolsUserData] = useState<PoolsState>(initialData)

  const fetchUserPoolsData = useCallback(() => {
    if (account) {
      const fetchPoolsUserDataAsync = async () => {
        try {
          const [stakedBalances, pendingRewards, totalStaking] = await Promise.all([
            fetchUserStakeBalances(account),
            fetchUserPendingRewards(account),
            cakeContract.balanceOf(initialData.data.contractAddress[safeChainId]),
          ])

          const userData = {
            sousId: initialData.data.sousId,
            allowance: '0',
            stakingTokenBalance: '0',
            stakedBalance: stakedBalances,
            pendingReward: pendingRewards,
          }

          setPoolsUserData((old) => ({
            data: {
              ...old.data,
              userData,
              totalStaked: new BigNumber(totalStaking.toString()).toJSON(),
            },
            userDataLoaded: true,
          }))
        } catch (error) {
          console.error('[Pools Action] Error fetching pool user data', error)
        }
      }

      fetchPoolsUserDataAsync()
    }
  }, [account])

  useFastRefreshEffect(() => {
    fetchUserPoolsData()
  }, [fetchUserPoolsData])

  return {
    data: transformPool(userPoolsData.data),
    userDataLoaded: userPoolsData.userDataLoaded,
    fetchUserPoolsData,
  }
}
