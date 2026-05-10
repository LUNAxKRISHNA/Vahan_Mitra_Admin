import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

// ─── Animated counter hook ────────────────────────────────────────────────────
function useCounter(end, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start = Math.min(start + step, end);
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);
  return count;
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
// Props: title, value, icon, accent, trend (+N%), subtitle
export default function StatCard({ title, value, icon: Icon, accent = 'stat-navy', subtitle, delay = 0 }) {
  const count = useCounter(typeof value === 'number' ? value : 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass-card-hover p-5 flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-navy-500 uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-bold text-navy-900 mt-1">
            {typeof value === 'number' ? count : value}
          </p>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={clsx('w-12 h-12 rounded-2xl flex items-center justify-center shadow-md', accent)}>
            <Icon size={22} className="text-white" />
          </div>
        )}

      </div>
    </motion.div>
  );
}

