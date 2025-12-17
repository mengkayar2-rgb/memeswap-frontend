import { Box, Text, UserMenuItem, TelosIcon, VelasIcon, MonadIcon } from 'packages/uikit'
import { useRouter } from 'next/router'
import { useTranslation } from 'contexts/Localization'
import { CHAIN_ID } from 'config/constants/networks'
import { addMonadNetwork } from 'utils/wallet'
import Wrapper from './Wrapper'

// Monad chainId
const MONAD_CHAIN_ID = 143

const chains = [
  { id: 143, label: 'Monad Mainnet (143)', Icon: MonadIcon, isMonad: true },
  { id: 106, url: 'https://exchange.wagyuswap.xyz', label: 'Velas', Icon: VelasIcon },
  { id: 0, url: 'https://telos.wagyuswap.xyz', label: 'Telos', Icon: TelosIcon },
]

const NetworkSelect = ({}) => {
  const { t } = useTranslation()
  const currentChainId = parseInt(CHAIN_ID, 10)

  const handleChainClick = async (chain: typeof chains[0]) => {
    if (chain.isMonad) {
      // Add Monad network to wallet
      await addMonadNetwork()
    } else if (chain.url && window) {
      window.location.replace(chain.url)
    }
  }

  return (
    <>
      {chains.map((chain) => (
        <UserMenuItem
          key={chain.id}
          style={{ justifyContent: 'flex-start' }}
          onClick={() => handleChainClick(chain)}
        >
          <chain.Icon />
          <Text bold={currentChainId === chain.id || (chain.isMonad && currentChainId === MONAD_CHAIN_ID)} pl="12px">
            {chain.label}
          </Text>
        </UserMenuItem>
      ))}
    </>
  )
}

export const NetworkSwitcher = () => {
  const { t } = useTranslation()
  const currentChainId = parseInt(CHAIN_ID, 10)
  
  // Find current network label
  const getCurrentLabel = () => {
    if (currentChainId === MONAD_CHAIN_ID) {
      return 'Monad Mainnet (143)'
    }
    const chain = chains.find((c) => c.id === currentChainId)
    return chain?.label || 'Select a Network'
  }

  return (
    <Box height="100%">
      <Wrapper mr="8px" placement="bottom" variant={'default'} text={t(getCurrentLabel())}>
        {() => <NetworkSelect />}
      </Wrapper>
    </Box>
  )
}
