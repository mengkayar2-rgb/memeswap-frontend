import React from 'react'
import styled, { keyframes } from 'styled-components'

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`

const SpinnerContainer = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  margin-bottom: 24px;
`

const Spinner = styled.div`
  width: 80px;
  height: 80px;
  border: 4px solid rgba(102, 126, 234, 0.2);
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`

const Logo = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 32px;
`

const LoadingText = styled.h2`
  color: #ffffff;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
  animation: ${pulse} 2s ease-in-out infinite;
`

const SubText = styled.p`
  color: #888888;
  font-size: 14px;
  margin: 0;
`

interface LoadingDEXProps {
  text?: string
  subtext?: string
  showOverlay?: boolean
}

const LoadingDEX: React.FC<LoadingDEXProps> = ({
  text = 'Loading MemeSwap...',
  subtext = 'Fetching pairs from subgraph...',
  showOverlay = true,
}) => {
  const content = (
    <>
      <SpinnerContainer>
        <Spinner />
        <Logo>🦊</Logo>
      </SpinnerContainer>
      <LoadingText>{text}</LoadingText>
      <SubText>{subtext}</SubText>
    </>
  )

  if (showOverlay) {
    return <Overlay>{content}</Overlay>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px' }}>
      {content}
    </div>
  )
}

export default LoadingDEX
