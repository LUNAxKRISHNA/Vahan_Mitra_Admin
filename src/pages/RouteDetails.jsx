import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Bus, Users, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import RouteTimeline from '../components/ui/RouteTimeline';
import StatusBadge   from '../components/ui/StatusBadge';

export default function RouteDetails() {
  const { id }     = useParams();
  const { state }  = useApp();
  const navigate   = useNavigate();

  const route = state.routes?.find(r => r.id === id || r.id === parseInt(id, 10));
  
  if (!route) {
    return (
      <div className="page-container flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-navy-600 font-semibold text-lg">Route not found</p>
        <button onClick={() => navigate('/routes')} className="btn-outline mt-4"><ArrowLeft size={16}/> Back to Routes</button>
      </div>
    );
  }

  const assignedAssignments = state.assignments?.filter(a => a.route_id === route.id) || [];
  
  const assignedBuses = assignedAssignments.map(a => 
    state.buses?.find(b => b.id === a.bus_id)
  ).filter(Boolean);
  
  const assignedDrivers = assignedAssignments.map(a => 
    state.drivers?.find(d => d.id === a.driver_id)
  ).filter(Boolean);

  const startPoint = route.route_stops?.[0]?.stop_name || 'Unknown Start';
  const endPoint = route.route_stops?.[route.route_stops.length - 1]?.stop_name || 'Unknown End';

  return (
    <div className="page-container">
      {/* Back */}
      <button onClick={() => navigate('/routes')} className="btn-ghost -ml-2 mb-2">
        <ArrowLeft size={16}/> Back to Routes
      </button>

      {/* Route header */}
      <div className="section-card bg-gradient-navy text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-teal-300 uppercase tracking-wider">Route ID: {route.id}</span>
            <h1 className="text-white text-xl mt-1">{route.route_name}</h1>
            <p className="text-navy-200 text-sm mt-1">{startPoint} → {endPoint}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            {[
              { label:'Est. Duration', value: route.estimated_duration || '—', icon: Clock  },
              { label:'Total Stops',   value: route.route_stops?.length || 0, icon: MapPin },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-white/10 rounded-xl p-3">
                <Icon size={16} className="text-teal-300 mx-auto mb-1" />
                <p className="text-xs text-navy-300">{label}</p>
                <p className="font-bold text-white text-sm">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stops timeline */}
        <div className="section-card lg:col-span-1">
          <h3 className="text-navy-900 mb-5">Stop Sequence</h3>
          <RouteTimeline stops={route.route_stops} />
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Assigned Buses */}
          <div className="section-card">
            <h3 className="text-navy-900 mb-4">Assigned Buses ({assignedBuses.length})</h3>
            {assignedBuses.length === 0 ? (
              <p className="text-sm text-slate-500">No buses currently assigned to this route.</p>
            ) : (
              <div className="space-y-3">
                {assignedBuses.map(bus => (
                  <div key={bus.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-navy-100 flex items-center justify-center">
                        <Bus size={16} className="text-navy-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-navy-900 text-sm">{bus.bus_no}</p>
                        <p className="text-xs text-slate-500">{bus.reg_number} · {bus.capacity} seats</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Assigned Drivers */}
          <div className="section-card">
            <h3 className="text-navy-900 mb-4">Assigned Drivers ({assignedDrivers.length})</h3>
            {assignedDrivers.length === 0 ? (
              <p className="text-sm text-slate-500">No drivers currently assigned to this route.</p>
            ) : (
              <div className="space-y-3">
                {assignedDrivers.map(driver => (
                  <div key={driver.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm">
                        {driver.name?.charAt(0) || 'D'}
                      </div>
                      <div>
                        <p className="font-semibold text-navy-900 text-sm">{driver.name}</p>
                        <p className="text-xs text-slate-500">{driver.phone} · {driver.license_number}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Route statistics */}
          <div className="section-card">
            <h3 className="text-navy-900 mb-4">Route Info</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Total Stops',       value: route.route_stops?.length || 0 },
                { label: 'Active Buses',      value: assignedBuses.length },
                { label: 'Assigned Drivers',  value: assignedDrivers.length },
                { label: 'Est. Duration',     value: route.estimated_duration || '—' },
              ].map(s => (
                <div key={s.label} className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
                  <p className="text-xs text-slate-500">{s.label}</p>
                  <p className="text-xl font-bold text-navy-900 mt-1">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
