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
      {/* Flow: Driver, Bus, Route vertically stacked */}
      <div className="space-y-3">
        {/* Row 1: Driver */}
        <div className="flex items-center gap-3 bg-slate-50/50 rounded-xl p-3 border border-slate-100 hover:bg-slate-50 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 shadow-sm">
            <User size={15} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Driver</p>
            <p className="font-semibold text-navy-900 truncate">{driver?.name ?? 'Unknown'}</p>
          </div>
        </div>

        {/* Row 2: Bus */}
        <div className="flex items-center gap-3 bg-slate-50/50 rounded-xl p-3 border border-slate-100 hover:bg-slate-50 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 shrink-0 shadow-sm">
            <Bus size={15} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Bus</p>
            <p className="font-semibold text-navy-900 truncate">
              {bus?.bus_no ?? 'Unknown'} <span className="text-slate-400 font-normal">({bus?.name || 'No Name'})</span>
            </p>
            {bus?.reg_number && (
              <p className="text-[9px] text-slate-400 font-medium tracking-tight mt-0.5">{bus?.reg_number}</p>
            )}
          </div>
        </div>

        {/* Row 3: Route */}
        <div className="flex items-center gap-3 bg-slate-50/50 rounded-xl p-3 border border-slate-100 hover:bg-slate-50 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 shadow-sm">
            <Route size={15} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Route</p>
            <p className="font-semibold text-navy-900 truncate">{route?.route_name ?? 'Unknown'}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
