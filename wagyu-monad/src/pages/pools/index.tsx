// Pools disabled for Monad - no subgraph available yet
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const PoolsPage = () => {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to swap page - pools requires subgraph
    router.push('/swap')
  }, [router])

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Pools Coming Soon</h2>
      <p>Pools feature is not available on Monad yet.</p>
    </div>
  )
}

export default PoolsPage
