import { GitBranch, User, Bus, Route, Trash2, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AssignmentCard({ assignment, driver, bus, route, onDelete, onEdit, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="glass-card p-5 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
            <GitBranch size={15} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-navy-900 uppercase tracking-tight">Active Assignment</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {onEdit && (
             <button
              onClick={() => onEdit(assignment)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-navy-50 hover:text-navy-600 transition-colors"
            >
              <Edit2 size={13} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(assignment.id)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Flow: Driver → Bus → Route */}
      <div className="flex items-center gap-2 text-xs">
        {/* Driver */}
        <div className="flex-1 flex items-center gap-2 bg-slate-50 rounded-xl p-3 border border-slate-100">
          <User size={14} className="text-navy-500 shrink-0" />
          <div className="min-w-0">
            <p className="text-navy-500 text-[10px] uppercase font-bold tracking-wider">Driver</p>
            <p className="font-bold text-navy-900 truncate">{driver?.name ?? 'Unknown'}</p>
          </div>
        </div>

        <div className="text-slate-300 font-bold">→</div>

        {/* Bus */}
        <div className="flex-1 flex items-center gap-2 bg-slate-50 rounded-xl p-3 border border-slate-100">
          <Bus size={14} className="text-teal-600 shrink-0" />
          <div className="min-w-0">
            <p className="text-teal-500 text-[10px] uppercase font-bold tracking-wider">Bus</p>
            <p className="font-bold text-navy-900 truncate">{bus?.bus_no ?? 'Unknown'} – {bus?.name}</p>
            <p className="text-[9px] text-slate-400 truncate">{bus?.reg_number}</p>
          </div>
        </div>

        <div className="text-slate-300 font-bold">→</div>

        {/* Route */}
        <div className="flex-1 flex items-center gap-2 bg-slate-50 rounded-xl p-3 border border-slate-100">
          <Route size={14} className="text-indigo-500 shrink-0" />
          <div className="min-w-0">
            <p className="text-indigo-400 text-[10px] uppercase font-bold tracking-wider">Route</p>
            <p className="font-bold text-navy-900 truncate">{route?.route_name ?? 'Unknown'}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
