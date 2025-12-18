import { ChainId } from '@pancakeswap-libs/sdk'
import MULTICALL_ABI from './abi.json'
import { getAddress } from '@ethersproject/address'

const MULTICALL_NETWORKS: { [chainId: number]: string } = {
  [ChainId.MAINNET]: getAddress('0x1Ee38d535d541c55C9dae27B12edf090C608E6Fb'), // TODO
  [ChainId.BSCTESTNET]: getAddress('0x301907b5835a2d723Fe3e9E8C5Bc5375d5c1236A'),
  143: getAddress('0x752521d2aA5F2EB39b76B4738A7E6a78503fE07e'),
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
