import clsx from 'clsx';
import { MapPin } from 'lucide-react';

export default function RouteTimeline({ stops = [] }) {
  if (!stops || stops.length === 0) {
    return <p className="text-slate-500 text-sm italic">No stops defined for this route.</p>;
  }

  return (
    <div className="relative">
      {/* vertical line */}
      <div className="absolute left-3.5 top-4 bottom-4 w-0.5 bg-gradient-to-b from-teal-400 via-teal-200 to-navy-200" />

      <div className="space-y-0">
        {stops.map((stop, i) => {
          const isFirst = i === 0;
          const isLast  = i === stops.length - 1;
          return (
            <div key={i} className="relative flex items-start gap-4 pb-6 last:pb-0">
              {/* Node */}
              <div className={clsx(
                'relative z-10 w-7 h-7 rounded-full flex items-center justify-center border-2 shrink-0',
                isFirst || isLast
                  ? 'bg-navy-900 border-navy-900'
                  : 'bg-white border-teal-400',
              )}>
                <MapPin size={12} className={isFirst || isLast ? 'text-white' : 'text-teal-600'} />
              </div>

              {/* Label */}
              <div className="flex-1 pt-0.5 min-w-0">
                <p className={clsx(
                  'text-sm font-semibold leading-tight truncate',
                  isFirst || isLast ? 'text-navy-900' : 'text-navy-700',
                )}>
                  {stop.stop_name}
                </p>
                <div className="flex flex-wrap gap-2 text-xs text-slate-500 mt-0.5">
                  {stop.arrival_time && <span>Time: {stop.arrival_time}</span>}
                  {(stop.lat || stop.long) && <span>Loc: {stop.lat}, {stop.long}</span>}
                </div>
                <span className={clsx(
                  'inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full',
                  isFirst ? 'bg-navy-100 text-navy-700' :
                  isLast  ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-500',
                )}>
                  {isFirst ? 'Origin' : isLast ? 'Destination' : `Stop ${stop.stop_order}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
