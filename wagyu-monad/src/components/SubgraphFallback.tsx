import React from 'react'
import styled from 'styled-components'

const FallbackContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: linear-gradient(135deg, #2d1f3d 0%, #1a1a2e 100%);
  border-radius: 16px;
  margin: 20px;
  text-align: center;
  border: 1px solid rgba(255, 107, 107, 0.3);
`

const Icon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`

const Title = styled.h3`
  color: #ff9f43;
  font-size: 18px;
  margin-bottom: 8px;
  font-weight: 600;
`

const Message = styled.p`
  color: #a0a0a0;
  font-size: 14px;
  margin-bottom: 20px;
  max-width: 350px;
`

const RetryButton = styled.button`
  background: #ff9f43;
  color: #1a1a2e;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #ffc107;
    transform: translateY(-1px);
  }
`

const StatusBadge = styled.span`
  display: inline-block;
  background: rgba(255, 107, 107, 0.2);
  color: #ff6b6b;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  margin-top: 16px;
`

interface SubgraphFallbackProps {
  onRetry?: () => void
  error?: string
}

const SubgraphFallback: React.FC<SubgraphFallbackProps> = ({ 
  onRetry,
  error 
}) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry()
    } else {
      window.location.reload()
    }
  }

  return (
    <FallbackContainer>
      <Icon>📡</Icon>
      <Title>Subgraph Temporarily Unavailable</Title>
      <Message>
        We are having trouble connecting to the data source. 
        This is usually temporary. Please try again in a moment.
      </Message>
      <RetryButton onClick={handleRetry}>
        🔄 Try Again
      </RetryButton>
      {error && (
        <StatusBadge>Error: {error}</StatusBadge>
      )}
    </FallbackContainer>
  )
}

export default SubgraphFallback
