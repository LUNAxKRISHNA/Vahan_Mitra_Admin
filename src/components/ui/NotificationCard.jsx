import { Bell, AlertTriangle, Info } from 'lucide-react';
import StatusBadge from './StatusBadge';
import clsx from 'clsx';

const TYPE_ICON = {
  Emergency: { icon: AlertTriangle, bg: 'bg-red-100',   text: 'text-red-600'   },
  Alert:     { icon: Bell,          bg: 'bg-amber-100', text: 'text-amber-600' },
  Info:      { icon: Info,          bg: 'bg-teal-100',  text: 'text-teal-600'  },
};

function fmtDate(iso) {
  return new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true });
}

export default function NotificationCard({ notif }) {
  const cfg  = TYPE_ICON[notif.type] || TYPE_ICON.Info;
  const Icon = cfg.icon;
  return (
    <div className="glass-card-hover p-4 flex gap-4 items-start">
      <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', cfg.bg)}>
        <Icon size={16} className={cfg.text} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-navy-900 truncate">{notif.title}</p>
          <StatusBadge status={notif.type} showDot={false} />
        </div>
        <p className="text-xs text-slate-600 mt-1 line-clamp-2">{notif.message}</p>
        <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
          <span>To: <strong className="text-navy-700">{notif.target}</strong></span>
          <span>·</span>
          <span>{fmtDate(notif.sentAt)}</span>
          <span>·</span>
          <StatusBadge status={notif.status} />
        </div>
        {notif.recipients > 0 && (
          <p className="text-xs text-teal-600 font-medium mt-1">{notif.recipients} recipients</p>
        )}
      </div>
    </div>
  );
}
