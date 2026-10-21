import Link from 'next/link'
import { Component, type ErrorInfo, type ReactNode } from 'react'

/* one error screen for app/error.tsx and this boundary. It sits above every layout, so it uses the
   global mm colour tokens and a system font. The raw message stays in the console: in production it
   is a generic English sentence. */
export function ErrorScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-start justify-center gap-5 bg-mm-paper px-6 text-mm-ink sm:items-center sm:text-center">
      <h1 className="text-2xl font-medium tracking-tight">Une erreur s&apos;est produite</h1>
      <p className="max-w-md text-sm text-mm-grey">
        La page n&apos;a pas pu s&apos;afficher. Réessayez. Si le problème continue, appelez le showroom.
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="min-h-11 rounded-mm bg-mm-ink px-5 text-sm font-medium text-mm-paper transition-colors hover:bg-mm-grey"
        >
          Réessayer
        </button>
        <Link href="/" className="flex min-h-11 items-center rounded-mm px-5 text-sm font-medium text-mm-ink underline-offset-4 hover:underline">
          Accueil
        </Link>
      </div>
    </main>
  )
}

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <ErrorScreen onRetry={() => window.location.reload()} />
    }
    return this.props.children
  }
}
