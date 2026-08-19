/** Skeleton placeholders matching the editorial feed layout while data loads. */
export default function EditorialSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="animate-pulse">
        <div className="aspect-[16/10] w-full rounded-xl bg-navy-100 sm:aspect-[16/8] lg:aspect-[21/9]" />
        <div className="mt-5 max-w-3xl space-y-3">
          <div className="h-3 w-28 rounded bg-navy-100" />
          <div className="h-8 w-3/4 rounded bg-navy-100" />
          <div className="h-4 w-full rounded bg-navy-100" />
          <div className="h-4 w-2/3 rounded bg-navy-100" />
          <div className="h-4 w-1/2 rounded bg-navy-100" />
        </div>
      </div>

      <div className="mt-10 animate-pulse border-t border-gray-200 pt-8">
        <div className="h-4 w-40 rounded bg-navy-100" />
        <div className="mt-4 space-y-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="grid grid-cols-[7rem_1fr] gap-4 sm:grid-cols-[12rem_1fr] sm:gap-6">
              <div className="aspect-[16/10] rounded-lg bg-navy-100" />
              <div className="space-y-2 py-1">
                <div className="h-3 w-24 rounded bg-navy-100" />
                <div className="h-5 w-3/4 rounded bg-navy-100" />
                <div className="h-3 w-1/2 rounded bg-navy-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}