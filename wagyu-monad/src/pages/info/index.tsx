// Info page - disabled for Monad (no subgraph)
import { useRouter } from 'next/router'
import { useEffect } from 'react'

// Check if Monad chain
const isMonad = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '143', 10) === 143

const InfoPage = () => {
  const router = useRouter()
  
  useEffect(() => {
    if (isMonad) {
      // Redirect to swap page - info requires subgraph
      router.push('/swap')
    }
  }, [router])

  if (isMonad) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Info Coming Soon</h2>
        <p>Info analytics is not available on Monad yet.</p>
      </div>
    )
  }

  // Original implementation for non-Monad chains
  const Overview = require('views/Info/Overview').default
  const { InfoPageLayout } = require('views/Info')
  
  const OriginalInfoPage = () => <Overview />
  OriginalInfoPage.Layout = InfoPageLayout
  
  return <Overview />
}

export default InfoPage
