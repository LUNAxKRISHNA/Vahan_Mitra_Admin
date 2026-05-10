import { ChevronRight, Home } from 'lucide-react';

// PageHeader — title + breadcrumb + optional right content
export default function PageHeader({ title, subtitle, breadcrumb = [], children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        {breadcrumb.length > 0 && (
          <nav className="flex items-center gap-1 text-xs text-slate-500 mb-1">
            <Home size={11} />
            {breadcrumb.map((b, i) => (
              <span key={i} className="flex items-center gap-1">
                <ChevronRight size={10} />
                <span className={i === breadcrumb.length - 1 ? 'text-navy-700 font-medium' : ''}>{b}</span>
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-navy-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-3 shrink-0">{children}</div>}
    </div>
  );
}
