import { motion } from 'framer-motion';
import clsx from 'clsx';

const TYPE_CONFIG = {
  create: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
  update: { bg: 'bg-blue-100', text: 'text-blue-600' },
  delete: { bg: 'bg-red-100', text: 'text-red-600' },
  notify: { bg: 'bg-amber-100', text: 'text-amber-600' },
  route: { bg: 'bg-teal-100', text: 'text-teal-600' },
  bus: { bg: 'bg-navy-100', text: 'text-navy-600' },
};

function fmtTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true });
}

export default function ActivityTimeline({ logs = [], limit }) {
  const items = limit ? logs.slice(0, limit) : logs;

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-5 top-0 bottom-0 w-px bg-slate-100" />

      <div className="space-y-4">
        {items.map((log, i) => {
          const cfg = TYPE_CONFIG[log.type] || TYPE_CONFIG.update;
          return (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="relative flex items-start gap-4 pl-2"
            >
              {/* Dot indicator */}
              <div className={clsx('relative z-10 w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5', cfg.bg)}>
                <div className={clsx('w-2 h-2 rounded-full', cfg.text.replace('text-', 'bg-'))} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 bg-white rounded-xl border border-slate-100 px-4 py-3 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-navy-900">{log.action}</p>
                  <time className="text-xs text-slate-400 whitespace-nowrap shrink-0">{fmtTime(log.timestamp)}</time>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">{log.description}</p>
                <p className="text-xs text-navy-400 mt-1">By {log.user}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

