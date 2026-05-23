export default function RootLoading() {
  return (
    <div className="min-h-screen bg-black animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-8 bg-gray-800 rounded w-1/4 mb-8" />
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[...Array(6)].map((_, i) => <div key={i} className="h-24 bg-gray-800 rounded-xl" />)}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-64 bg-gray-800 rounded-xl" />
          <div className="h-64 bg-gray-800 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
