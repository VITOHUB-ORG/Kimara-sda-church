function SkeletonCard() {
  return (
    <div className="flex animate-pulse flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="h-12 w-12 rounded-full bg-gray-200" />
        <div className="h-5 w-20 rounded-full bg-gray-200" />
      </div>
      <div className="mt-4 h-5 w-3/4 rounded bg-gray-200" />
      <div className="mt-2 h-4 w-24 rounded bg-gray-200" />
      <div className="mt-3 space-y-2">
        <div className="h-3 w-full rounded bg-gray-100" />
        <div className="h-3 w-5/6 rounded bg-gray-100" />
      </div>
      <div className="mt-5 h-10 w-full rounded-full bg-gray-200" />
    </div>
  );
}

export default function Loading() {
  return (
    <>
      <div className="animate-pulse bg-navy-950 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-3 w-32 rounded bg-navy-700" />
          <div className="mt-4 h-8 w-64 rounded bg-navy-700 sm:h-10" />
          <div className="mt-3 h-4 w-full max-w-xl rounded bg-navy-700" />
        </div>
      </div>
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 h-4 w-40 animate-pulse rounded bg-gray-200" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}