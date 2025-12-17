// Farms disabled for Monad - no subgraph available yet
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const FarmsPage = () => {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to swap page - farms requires subgraph
    router.push('/swap')
  }, [router])

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Farms Coming Soon</h2>
      <p>Farms feature is not available on Monad yet.</p>
    </div>
  )
}

export default FarmsPage
