import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-noir-950 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-noir-900 border border-noir-800 rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-serif text-white mb-2">Une erreur s'est produite</h1>
            <p className="text-white/60 mb-6">
              Nous sommes désolés, une erreur inattendue s'est produite. Veuillez rafraîchir la page ou réessayer plus tard.
            </p>
            {this.state.error && (
              <details className="text-left mb-6">
                <summary className="text-sm text-white/40 cursor-pointer hover:text-white/60 transition-colors">
                  Détails techniques
                </summary>
                <pre className="mt-2 text-xs text-red-400 bg-noir-950 p-3 rounded overflow-auto max-h-32">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-gold-400 text-noir-950 font-semibold rounded hover:bg-gold-300 transition-colors"
            >
              Rafraîchir la page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
