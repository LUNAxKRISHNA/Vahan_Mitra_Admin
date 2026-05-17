import clsx from 'clsx';

// status -> badge class mapping
const STATUS_MAP = {
  // Driver / Bus statuses
  'Active': 'badge-green',
  'Inactive': 'badge-gray',
  'On Leave': 'badge-amber',
  'Training': 'badge-blue',
  'Maintenance': 'badge-amber',
  'Idle': 'badge-navy',
  // Notification statuses
  'Delivered': 'badge-teal',
  'Pending': 'badge-amber',
  'Failed': 'badge-red',
  // Assignment statuses
  'Scheduled': 'badge-blue',
  'Completed': 'badge-green',
  'Cancelled': 'badge-red',
  // Notification types
  'Emergency': 'badge-red',
  'Alert': 'badge-amber',
  'Info': 'badge-teal',
};

const DOT_MAP = {
  'Active': 'bg-emerald-500',
  'Inactive': 'bg-slate-400',
  'On Leave': 'bg-amber-500',
  'Training': 'bg-blue-500',
  'Maintenance': 'bg-amber-500',
  'Idle': 'bg-navy-400',
  'Delivered': 'bg-teal-500',
  'Pending': 'bg-amber-500',
  'Completed': 'bg-emerald-500',
  'Scheduled': 'bg-blue-500',
  'Emergency': 'bg-red-500',
  'Alert': 'bg-amber-500',
  'Info': 'bg-teal-500',
};

export default function StatusBadge({ status, showDot = true }) {
  const cls = STATUS_MAP[status] || 'badge-gray';
  const dot = DOT_MAP[status] || 'bg-slate-400';
  return (
    <span className={cls}>
      {showDot && <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', dot)} />}
      {status}
    </span>
  );
}
