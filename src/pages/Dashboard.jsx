import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { GitBranch, Map, Users, Bus, UserPlus, MapPin, Navigation, Phone } from 'lucide-react';
import AssignmentCard from '../components/ui/AssignmentCard';
import StatCard from '../components/ui/StatCard';
import StatusBadge from '../components/ui/StatusBadge';

export default function Dashboard() {
  const { state } = useApp();
  const { adminProfile } = useAuth();
  const navigate = useNavigate();

  const assignments = state.assignments || [];
  const routes = state.routes || [];
  const drivers = state.drivers || [];
  const buses = state.buses || [];
  
  const displayName = adminProfile?.name || 'Admin';

  // KPI Calculations
  const activeDriversCount = drivers.filter(d => d.status === 'Active').length;
  const activeBusesCount = buses.filter(b => b.status === 'Active').length;

  return (
    <div className="page-container">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-navy-900 font-bold">Fleet Operations Control</h1>
          <p className="text-sm text-slate-500 mt-1">Welcome back, {displayName}. Here is your live overview.</p>
        </div>
      </div>

      {/* ── KPI Ribbon ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
        <StatCard 
          title="Active Assignments" 
          value={assignments.length} 
          icon={GitBranch} 
          accent="stat-indigo" 
        />
        <StatCard 
          title="Network Routes" 
          value={routes.length} 
          icon={Map} 
          accent="stat-amber" 
          subtitle="Total covered transit paths"
        />
        <StatCard 
          title="Crew Roster" 
          value={drivers.length} 
          icon={Users} 
          accent="stat-navy" 
          subtitle={`${activeDriversCount} drivers currently active`}
        />
        <StatCard 
          title="Total Fleet" 
          value={buses.length} 
          icon={Bus} 
          accent="stat-teal" 
          subtitle={`${activeBusesCount} buses available`}
        />
      </div>

      {/* ── Main Workspace ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Assignments Feed */}
          <div className="section-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Navigation size={16} className="text-indigo-600" />
                </div>
                <h2 className="text-base font-bold text-navy-900">Live Assignments Feed</h2>
              </div>
              <button onClick={() => navigate('/assignments')} className="btn-ghost text-xs">
                View All
              </button>
            </div>
            
            {assignments.length === 0 ? (
              <div className="py-8 text-center border-dashed border-2 rounded-xl border-slate-100">
                <p className="text-sm text-slate-500">No active assignments configured.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assignments.slice(0, 6).map((a, i) => (
                  <AssignmentCard
                    key={a.id || i}
                    assignment={a}
                    driver={drivers.find(d => d.id === a.driver_id)}
                    bus={buses.find(b => b.id === a.bus_id)}
                    route={routes.find(r => r.id === a.route_id)}
                    index={i}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-6">
          
          {/* Quick Operations */}
          <div className="section-card">
            <h2 className="text-base font-bold text-navy-900 mb-4">Quick Operations</h2>
            <div className="grid grid-cols-1 gap-3">
              <button onClick={() => navigate('/assignments')} className="btn-primary justify-center w-full">
                <Navigation size={16} /> New Assignment
              </button>
              <button onClick={() => navigate('/drivers')} className="btn-secondary justify-center w-full">
                <UserPlus size={16} /> Add Driver
              </button>
              <button onClick={() => navigate('/routes')} className="btn-outline justify-center w-full">
                <MapPin size={16} /> Configure Route
              </button>
            </div>
          </div>

          {/* Active Crew Roster */}
          <div className="section-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-navy-50 flex items-center justify-center">
                  <Users size={16} className="text-navy-600" />
                </div>
                <h2 className="text-base font-bold text-navy-900">Active Crew Roster</h2>
              </div>
              <button onClick={() => navigate('/drivers')} className="btn-ghost text-xs">
                All Crew
              </button>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {drivers.slice(0, 8).map(driver => (
                <div key={driver.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-navy-100 to-navy-200 flex items-center justify-center text-navy-700 font-bold shadow-sm">
                      {driver.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-navy-900">{driver.name}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Phone size={10} /> {driver.phone || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={driver.status} />
                </div>
              ))}
              {drivers.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">No drivers registered.</p>
              )}
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
}
