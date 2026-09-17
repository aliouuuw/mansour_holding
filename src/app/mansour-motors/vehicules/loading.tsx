export default function Loading() {
  return (
    <div className="motors-theme min-h-screen bg-white">
      <div className="h-[50vh] min-h-[380px] bg-noir-950" />
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[16/10] bg-noir-100" />
              <div className="border-t border-noir-100 bg-white px-5 py-4">
                <div className="h-4 w-2/3 rounded bg-noir-100" />
                <div className="mt-2 h-3 w-1/3 rounded bg-noir-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
