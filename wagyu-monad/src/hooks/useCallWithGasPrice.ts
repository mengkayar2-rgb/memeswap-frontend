import { useCallback } from 'react'
import { TransactionResponse } from '@ethersproject/providers'
import { Contract, CallOverrides } from '@ethersproject/contracts'
import get from 'lodash/get'

/**
 * Simplified hook - let MetaMask handle gas estimation
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
      
      // Let MetaMask handle gas - pass only user overrides if any
      const tx = await contractMethod(...methodArgs, overrides || {})
      return tx
    },
    [],
  )

  return { callWithGasPrice }
}
