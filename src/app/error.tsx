'use client'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-noir-950 px-4 text-center text-white">
      <p className="text-sm uppercase tracking-widest text-gold-400">Une erreur s est produite</p>
      <p className="max-w-md text-sm text-silver-400">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="bg-gold-400 px-5 py-2 text-xs font-bold uppercase tracking-widest text-noir-950"
      >
        Reessayer
      </button>
    </div>
  )
}
