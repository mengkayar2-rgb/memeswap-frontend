import { useCallback } from 'react'
import { TransactionResponse } from '@ethersproject/providers'
import { Contract, CallOverrides } from '@ethersproject/contracts'
import { parseUnits } from '@ethersproject/units'
import { useGasPrice } from 'state/user/hooks'
import { CHAIN_ID } from 'config/constants/networks'
import get from 'lodash/get'
import * as Sentry from '@sentry/react'

// Monad chain configuration
const MONAD_CHAIN_ID = 143
const MONAD_DEFAULT_GAS_PRICE = parseUnits('1.5', 'gwei')
const isMonadChain = parseInt(CHAIN_ID, 10) === MONAD_CHAIN_ID

export function useCallWithGasPrice() {
  const gasPrice = useGasPrice()

  /**
   * Perform a contract call with a gas price returned from useGasPrice
   * @param contract Used to perform the call
   * @param methodName The name of the method called
   * @param methodArgs An array of arguments to pass to the method
   * @param overrides An overrides object to pass to the method. gasPrice passed in here will take priority over the price returned by useGasPrice
   * @returns https://docs.ethers.io/v5/api/providers/types/#providers-TransactionReceipt
   */
  const callWithGasPrice = useCallback(
    async (
      contract: Contract,
      methodName: string,
      methodArgs: any[] = [],
      overrides: CallOverrides = null,
    ): Promise<TransactionResponse> => {
      // Use Monad default gas price if on Monad chain and no manual override
      const effectiveGasPrice = isMonadChain && !overrides?.gasPrice ? MONAD_DEFAULT_GAS_PRICE : gasPrice

      Sentry.addBreadcrumb({
        type: 'Transaction',
        message: `Call with gas price: ${effectiveGasPrice}`,
        data: {
          contractAddress: contract.address,
          methodName,
          methodArgs,
          overrides,
          isMonadChain,
        },
      })

      const contractMethod = get(contract, methodName)
      const hasManualGasPriceOverride = overrides?.gasPrice

      // For Monad, always use manual gas price if not provided in overrides
      const finalOverrides = hasManualGasPriceOverride
        ? { ...overrides }
        : { ...overrides, gasPrice: effectiveGasPrice }

      const tx = await contractMethod(...methodArgs, finalOverrides)

      if (tx) {
        Sentry.addBreadcrumb({
          type: 'Transaction',
          message: `Transaction sent: ${tx.hash}`,
          data: {
            hash: tx.hash,
            from: tx.from,
            gasLimit: tx.gasLimit?.toString(),
            nonce: tx.nonce,
          },
        })
      }

      return tx
    },
    [gasPrice],
  )

  return { callWithGasPrice }
}
