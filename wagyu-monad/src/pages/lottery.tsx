// Lottery disabled for Monad - no subgraph available yet
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const LotteryPage = () => {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to home page - lottery requires subgraph
    router.push('/')
  }, [router])

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Lottery Coming Soon</h2>
      <p>Lottery feature is not available on Monad yet.</p>
    </div>
  )
}

export default LotteryPage
