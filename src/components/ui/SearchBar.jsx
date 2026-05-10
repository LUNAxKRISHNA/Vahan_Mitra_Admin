import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search…', className = '' }) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search size={15} className="absolute left-3 text-slate-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-8 py-2.5 text-sm rounded-xl border border-slate-200 bg-white
                   focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500
                   placeholder:text-slate-400 transition-all duration-150 shadow-sm"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2.5 text-slate-400 hover:text-navy-600 transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
