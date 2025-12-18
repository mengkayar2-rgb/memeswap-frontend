import React, { Component, ErrorInfo, ReactNode } from 'react'
import styled from 'styled-components'

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 40px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 16px;
  margin: 20px;
  text-align: center;
`

const ErrorIcon = styled.div`
  font-size: 64px;
  margin-bottom: 20px;
`

const ErrorTitle = styled.h2`
  color: #ff6b6b;
  font-size: 24px;
  margin-bottom: 12px;
  font-weight: 600;
`

const ErrorMessage = styled.p`
  color: #a0a0a0;
  font-size: 14px;
  margin-bottom: 24px;
  max-width: 400px;
`

const ReloadButton = styled.button`
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
`

const ErrorDetails = styled.details`
  margin-top: 20px;
  color: #666;
  font-size: 12px;
  max-width: 500px;
  text-align: left;
  
  summary {
    cursor: pointer;
    color: #888;
  }
  
  pre {
    background: #0d0d0d;
    padding: 12px;
    border-radius: 8px;
    overflow-x: auto;
    margin-top: 8px;
  }
`

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

class ErrorBoundaryStrict extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo })
    
    // Log to console
    console.error('[ErrorBoundary] Caught error:', error)
    console.error('[ErrorBoundary] Error info:', errorInfo)
    
    // Log to Sentry if available
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, { extra: errorInfo })
    }
  }

  handleReload = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    window.location.reload()
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <ErrorContainer>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorTitle>Something went wrong</ErrorTitle>
          <ErrorMessage>
            MemeSwap encountered an unexpected error. This has been logged and we are working on a fix.
          </ErrorMessage>
          <ReloadButton onClick={this.handleReload}>
            🔄 Reload Page
          </ReloadButton>
          {this.state.error && (
            <ErrorDetails>
              <summary>Technical Details</summary>
              <pre>{this.state.error.toString()}</pre>
              {this.state.errorInfo && (
                <pre>{this.state.errorInfo.componentStack}</pre>
              )}
            </ErrorDetails>
          )}
        </ErrorContainer>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundaryStrict
