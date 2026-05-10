// Loading skeleton for tables and cards
export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 px-4 py-3 border-b border-slate-100">
          {Array.from({ length: cols }).map((_, j) => (
            <div
              key={j}
              className="h-4 bg-slate-100 rounded-full flex-1"
              style={{ opacity: 1 - j * 0.1 }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-3 w-24 bg-slate-100 rounded-full" />
            <div className="w-10 h-10 rounded-xl bg-slate-100" />
          </div>
          <div className="h-8 w-16 bg-slate-100 rounded-full" />
          <div className="h-3 w-32 bg-slate-100 rounded-full" />
        </div>
      ))}
    </div>
  );
}
