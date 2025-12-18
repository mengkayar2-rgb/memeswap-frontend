import { SerializedFarm } from 'state/types'
import { CHAIN_ID } from '../../config/constants/networks'

// Safe chainId with fallback
const safeChainId = (CHAIN_ID || '143') as '143' | '111' | '106'

const getFarmsAuctionData = (farms: SerializedFarm[], winnerFarms: string[], auctionHostingEndDate: string) => {
  return farms.map((farm) => {
    const lpAddress = farm.lpAddresses?.[safeChainId] || ''
    const isAuctionWinnerFarm = lpAddress && winnerFarms.find(
      (winnerFarm) => winnerFarm.toLowerCase() === lpAddress.toLowerCase(),
    )
    return {
      ...farm,
      ...(isAuctionWinnerFarm && { isCommunity: true, auctionHostingEndDate }),
    }
  })
}

export default getFarmsAuctionData
