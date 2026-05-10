import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Bus, Users, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import RouteTimeline from '../components/ui/RouteTimeline';
import StatusBadge   from '../components/ui/StatusBadge';

export default function RouteDetails() {
  const { id }     = useParams();
  const { state }  = useApp();
  const navigate   = useNavigate();

  const route = state.routes.find(r => r.id === id);
  if (!route) {
    return (
      <div className="page-container flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-navy-600 font-semibold text-lg">Route not found</p>
        <button onClick={() => navigate('/routes')} className="btn-outline mt-4"><ArrowLeft size={16}/> Back to Routes</button>
      </div>
    );
  }

  const assignedBuses   = state.buses.filter(b => b.routeId === id);
  const assignedDrivers = assignedBuses.map(b => state.drivers.find(d => d.id === b.driverId)).filter(Boolean);

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
            <span className="text-xs font-semibold text-teal-300 uppercase tracking-wider">{route.id}</span>
            <h1 className="text-white text-xl mt-1">{route.name}</h1>
            <p className="text-navy-200 text-sm mt-1">{route.startPoint} → {route.endPoint}</p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label:'Distance',  value: route.distance,      icon: MapPin },
              { label:'Est. Time', value: route.estimatedTime, icon: Clock  },
              { label:'Daily Trips',value:`${route.totalTrips}`, icon: TrendingUp },
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
          <RouteTimeline stops={route.stops || []} />
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
                  <div key={bus.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-navy-100 flex items-center justify-center">
                        <Bus size={16} className="text-navy-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-navy-900 text-sm">{bus.id}</p>
                        <p className="text-xs text-slate-500">{bus.regNumber} · {bus.capacity} seats · {bus.fuel}</p>
                      </div>
                    </div>
                    <StatusBadge status={bus.status} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Assigned Drivers */}
          <div className="section-card">
            <h3 className="text-navy-900 mb-4">Assigned Drivers ({assignedDrivers.length})</h3>
            {assignedDrivers.length === 0 ? (
              <p className="text-sm text-slate-500">No drivers currently assigned to buses on this route.</p>
            ) : (
              <div className="space-y-3">
                {assignedDrivers.map(driver => (
                  <div key={driver.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm">
                        {driver.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-navy-900 text-sm">{driver.name}</p>
                        <p className="text-xs text-slate-500">{driver.phone} · {driver.license}</p>
                      </div>
                    </div>
                    <StatusBadge status={driver.status} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Route statistics */}
          <div className="section-card">
            <h3 className="text-navy-900 mb-4">Route Statistics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: 'Active Passengers', value: route.activePassengers?.toLocaleString() ?? '—' },
                { label: 'Daily Trips',       value: route.totalTrips },
                { label: 'Total Stops',       value: route.stops?.length ?? 0 },
                { label: 'Active Buses',      value: assignedBuses.filter(b => b.status === 'Active').length },
                { label: 'Distance',          value: route.distance },
                { label: 'Travel Time',       value: route.estimatedTime },
              ].map(s => (
                <div key={s.label} className="bg-slate-50 rounded-xl p-4 text-center">
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
