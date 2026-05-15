import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { GitBranch } from 'lucide-react';
import AssignmentCard from '../components/ui/AssignmentCard';

export default function Dashboard() {
  const { state } = useApp();
  const navigate = useNavigate();

  const assignments = state.assignments || [];

  return (
    <div className="page-container">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-navy-900 font-bold">Good morning, Admin! 👋</h1>
          <p className="text-sm text-slate-500 mt-1">Here is your fleet overview for today.</p>
        </div>
        <button onClick={() => navigate('/assignments')} className="btn-primary">
          Manage Assignments
        </button>
      </div>

      {/* ── Assignments Listing ─────────────────────────────────────── */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <GitBranch size={20} className="text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-navy-900">Current Assignments</h2>
              <p className="text-xs text-slate-500">{assignments.length} total active assignments</p>
            </div>
          </div>
        </div>

        {assignments.length === 0 ? (
          <div className="section-card flex flex-col items-center py-16 text-center border-dashed border-2">
            <GitBranch size={48} className="text-slate-200 mb-4" />
            <p className="text-navy-700 font-bold text-lg">No assignments configured</p>
            <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto">
              You haven't assigned any drivers or buses to routes yet.
            </p>
            <button 
              onClick={() => navigate('/assignments')} 
              className="mt-6 btn-primary"
            >
              Configure Fleet
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {assignments.slice(0, 8).map((a, i) => (
              <AssignmentCard
                key={a.id || i}
                assignment={a}
                driver={state.drivers?.find(d => d.id === a.driver_id)}
                bus={state.buses?.find(b => b.id === a.bus_id)}
                route={state.routes?.find(r => r.id === a.route_id)}
                index={i}
              />
            ))}
          </div>
        )}

        {assignments.length > 8 && (
          <div className="mt-8 flex justify-center">
            <button 
              onClick={() => navigate('/assignments')} 
              className="btn-ghost flex items-center gap-2 text-navy-600 font-semibold"
            >
              View all {assignments.length} assignments
              <GitBranch size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
