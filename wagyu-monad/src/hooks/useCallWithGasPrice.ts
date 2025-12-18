import { useCallback } from 'react'
import { TransactionResponse } from '@ethersproject/providers'
import { Contract, CallOverrides } from '@ethersproject/contracts'
import { parseUnits } from '@ethersproject/units'
import get from 'lodash/get'

// Monad gas settings - HARDCODED for chain 143
const MONAD_GAS_LIMIT = 150000 // Safe gas limit for Monad
const MONAD_GAS_PRICE = parseUnits('1.5', 'gwei') // 1.5 gwei

/**
 * Hook with hardcoded gas settings for Monad chain 143
 */
export function useCallWithGasPrice() {
  const callWithGasPrice = useCallback(
    async (
      contract: Contract,
      methodName: string,
      methodArgs: any[] = [],
      overrides: CallOverrides = null,
    ): Promise<TransactionResponse> => {
      const contractMethod = get(contract, methodName)
      
      // Monad gas settings - hardcoded
      const gasSettings = {
        gasLimit: MONAD_GAS_LIMIT,
        gasPrice: MONAD_GAS_PRICE,
        ...overrides,
      }
      
      const tx = await contractMethod(...methodArgs, gasSettings)
      return tx
    },
    [],
  )

  return { callWithGasPrice }
}
