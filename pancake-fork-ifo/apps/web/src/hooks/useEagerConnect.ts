import { useEffect } from 'react'
import { useConfig } from 'wagmi'

const useEagerConnect = () => {
  const config = useConfig()
  useEffect(() => {
    config.autoConnect()
  }, [config])
}

export default useEagerConnect
