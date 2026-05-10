import { useState, useMemo } from 'react';
import { Plus, Trash2, GitBranch } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';
import PageHeader    from '../components/ui/PageHeader';
import AssignmentCard from '../components/ui/AssignmentCard';
import Modal         from '../components/ui/Modal';
import SearchBar     from '../components/ui/SearchBar';
import { FormSelect } from '../components/ui/FormInput';
import StatusBadge   from '../components/ui/StatusBadge';

const EMPTY = { driverId:'', busId:'', routeId:'', shift:'Morning', startTime:'06:00', endTime:'10:00', status:'Active', date: new Date().toISOString().split('T')[0] };

export default function Assignments() {
  const { state, dispatch } = useApp();
  const [search,  setSearch]  = useState('');
  const [modal,   setModal]   = useState(false);
  const [form,    setForm]    = useState(EMPTY);
  const [filterStatus, setFilterStatus] = useState('All');

  const filtered = useMemo(() => {
    return state.assignments.filter(a => {
      const driver = state.drivers.find(d => d.id === a.driverId);
      const route  = state.routes.find(r => r.id === a.routeId);
      const matchS = !search || [a.busId, a.driverId, a.routeId, driver?.name, route?.name].some(f => f?.toLowerCase().includes(search.toLowerCase()));
      const matchF = filterStatus === 'All' || a.status === filterStatus;
      return matchS && matchF;
    });
  }, [state.assignments, search, filterStatus, state.drivers, state.routes]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.driverId || !form.busId || !form.routeId) { toast.error('Select driver, bus and route'); return; }
    dispatch({ type: 'ADD_ASSIGNMENT', payload: form });
    toast.success('Assignment created');
    setModal(false); setForm(EMPTY);
  };

  const STATUS_OPTS = ['All','Active','Scheduled','Completed','Cancelled'];

  // Summary counts
  const counts = {
    Active:    state.assignments.filter(a => a.status === 'Active').length,
    Scheduled: state.assignments.filter(a => a.status === 'Scheduled').length,
    Completed: state.assignments.filter(a => a.status === 'Completed').length,
  };

  return (
    <div className="page-container">
      <PageHeader title="Assignment Management" subtitle="Manage driver–bus–route assignments" breadcrumb={['Assignments']}>
        <button className="btn-primary" onClick={() => setModal(true)}><Plus size={16}/> New Assignment</button>
      </PageHeader>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(counts).map(([s, c]) => (
          <div key={s} className="glass-card p-4 cursor-pointer hover:shadow-glass-lg transition-shadow" onClick={() => setFilterStatus(s)}>
            <StatusBadge status={s} />
            <p className="text-2xl font-bold text-navy-900 mt-2">{c}</p>
            <p className="text-xs text-slate-500">assignments</p>
          </div>
        ))}
      </div>

      {/* Filter & search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by driver, bus, route…" className="flex-1" />
        <div className="flex gap-2">
          {STATUS_OPTS.map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterStatus === s ? 'bg-navy-900 text-white' : 'bg-slate-100 text-navy-600 hover:bg-slate-200'}`}>{s}</button>
          ))}
        </div>
      </div>

      {/* Assignment Cards */}
      {filtered.length === 0 ? (
        <div className="section-card flex flex-col items-center py-12 text-center">
          <GitBranch size={40} className="text-slate-200 mb-3" />
          <p className="text-navy-700 font-semibold">No assignments found</p>
          <p className="text-sm text-slate-500 mt-1">Create a new assignment to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((a, i) => (
            <AssignmentCard
              key={a.id}
              assignment={a}
              driver={state.drivers.find(d => d.id === a.driverId)}
              bus={state.buses.find(b => b.id === a.busId)}
              route={state.routes.find(r => r.id === a.routeId)}
              index={i}
              onDelete={(id) => { dispatch({ type:'DELETE_ASSIGNMENT', payload: id }); toast.success('Assignment removed'); }}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal open={modal} onClose={() => { setModal(false); setForm(EMPTY); }} title="Create New Assignment" size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormSelect label="Driver" id="a-driver" required value={form.driverId} onChange={e => setForm(p => ({ ...p, driverId: e.target.value }))}>
            <option value="">— Select Driver —</option>
            {state.drivers.filter(d => d.status === 'Active').map(d => (
              <option key={d.id} value={d.id}>{d.name} ({d.id})</option>
            ))}
          </FormSelect>
          <FormSelect label="Bus" id="a-bus" required value={form.busId} onChange={e => setForm(p => ({ ...p, busId: e.target.value }))}>
            <option value="">— Select Bus —</option>
            {state.buses.map(b => (
              <option key={b.id} value={b.id}>{b.id} – {b.regNumber}</option>
            ))}
          </FormSelect>
          <FormSelect label="Route" id="a-route" required value={form.routeId} onChange={e => setForm(p => ({ ...p, routeId: e.target.value }))}>
            <option value="">— Select Route —</option>
            {state.routes.map(r => (
              <option key={r.id} value={r.id}>{r.id} – {r.name}</option>
            ))}
          </FormSelect>
          <div className="grid grid-cols-2 gap-4">
            <FormSelect label="Shift" id="a-shift" value={form.shift} onChange={e => setForm(p => ({ ...p, shift: e.target.value }))}>
              {['Morning','Afternoon','Evening','Night'].map(s => <option key={s}>{s}</option>)}
            </FormSelect>
            <FormSelect label="Status" id="a-status" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
              {['Active','Scheduled'].map(s => <option key={s}>{s}</option>)}
            </FormSelect>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="input-label">Start Time</label>
              <input type="time" value={form.startTime} onChange={e => setForm(p => ({ ...p, startTime: e.target.value }))} className="input-field" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="input-label">End Time</label>
              <input type="time" value={form.endTime} onChange={e => setForm(p => ({ ...p, endTime: e.target.value }))} className="input-field" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setModal(false); setForm(EMPTY); }} className="btn-outline">Cancel</button>
            <button type="submit" className="btn-primary">Create Assignment</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
