import { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, MapPin, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import PageHeader from '../components/ui/PageHeader';
import Modal      from '../components/ui/Modal';
import SearchBar  from '../components/ui/SearchBar';
import { FormInput } from '../components/ui/FormInput';

const EMPTY = { name:'', startPoint:'', endPoint:'', distance:'', estimatedTime:'', stops:[] };

export default function Routes() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [search,     setSearch]     = useState('');
  const [modal,      setModal]      = useState(null);
  const [form,       setForm]       = useState(EMPTY);
  const [editing,    setEditing]    = useState(null);
  const [delConfirm, setDelConfirm] = useState(null);
  const [stopInput,  setStopInput]  = useState('');

  const filtered = useMemo(() =>
    state.routes.filter(r => !search || r.name.toLowerCase().includes(search.toLowerCase())),
    [state.routes, search]
  );

  const openAdd  = () => { setForm(EMPTY); setEditing(null); setModal('add'); };
  const openEdit = (r) => { setForm({ ...r, stops: r.stops?.map(s => s.name || s) || [] }); setEditing(r.id); setModal('edit'); };
  const closeModal = () => { setModal(null); setForm(EMPTY); setEditing(null); setStopInput(''); };

  const addStop = () => {
    if (!stopInput.trim()) return;
    setForm(p => ({ ...p, stops: [...(p.stops || []), stopInput.trim()] }));
    setStopInput('');
  };
  const removeStop = (i) => setForm(p => ({ ...p, stops: p.stops.filter((_, idx) => idx !== i) }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.startPoint || !form.endPoint) { toast.error('Fill required fields'); return; }
    const stopObjs = (form.stops || []).map((s, i, arr) => ({
      name: typeof s === 'string' ? s : s.name,
      time: typeof s === 'object' ? s.time : '',
      type: i === 0 ? 'start' : i === arr.length - 1 ? 'end' : 'stop',
    }));
    if (editing) {
      dispatch({ type: 'UPDATE_ROUTE', payload: { ...form, id: editing, stops: stopObjs } });
      toast.success('Route updated');
    } else {
      dispatch({ type: 'ADD_ROUTE', payload: { ...form, stops: stopObjs } });
      toast.success('Route created');
    }
    closeModal();
  };

  return (
    <div className="page-container">
      <PageHeader title="Route Management" subtitle={`${state.routes.length} routes configured`} breadcrumb={['Routes']}>
        <button className="btn-primary" onClick={openAdd}><Plus size={16}/> Add Route</button>
      </PageHeader>

      {/* Search */}
      <SearchBar value={search} onChange={setSearch} placeholder="Search routes…" className="max-w-sm" />

      {/* Route Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((route, i) => {
          const assignedBuses = state.buses.filter(b => b.routeId === route.id);
          return (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass-card p-5 space-y-4 hover:shadow-glass-lg transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="badge badge-teal text-[10px] mb-1">{route.id}</span>
                  <h3 className="text-navy-900 text-sm font-bold leading-tight">{route.name}</h3>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(route)} className="btn-ghost p-1.5"><Edit2 size={13}/></button>
                  <button onClick={() => setDelConfirm(route.id)} className="btn-ghost p-1.5 hover:!bg-red-50 hover:!text-red-500"><Trash2 size={13}/></button>
                </div>
              </div>

              {/* Route endpoints */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-navy-600 shrink-0" />
                  <span className="truncate">{route.startPoint}</span>
                </div>
                <div className="ml-1 pl-[3px] border-l-2 border-dashed border-slate-200 py-1 text-slate-400 text-[10px]">
                  {route.stops?.length ? `${route.stops.length - 2} intermediate stops` : 'Direct'}
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-teal-600 shrink-0" />
                  <span className="truncate">{route.endPoint}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-slate-50 rounded-lg p-2 text-center">
                  <p className="text-slate-400 text-[10px]">Distance</p>
                  <p className="font-bold text-navy-900">{route.distance}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2 text-center">
                  <p className="text-slate-400 text-[10px]">ETA</p>
                  <p className="font-bold text-navy-900">{route.estimatedTime}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2 text-center">
                  <p className="text-slate-400 text-[10px]">Buses</p>
                  <p className="font-bold text-navy-900">{assignedBuses.length}</p>
                </div>
              </div>

              {/* View Details */}
              <button
                onClick={() => navigate(`/routes/${route.id}`)}
                className="w-full btn-outline text-xs py-2 justify-center"
              >
                View Details <ArrowRight size={13}/>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      <Modal open={!!modal} onClose={closeModal} title={modal === 'edit' ? 'Edit Route' : 'Add New Route'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput label="Route Name" id="r-name" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Majestic – Whitefield Express" />
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Start Point" id="r-start" required value={form.startPoint} onChange={e => setForm(p => ({ ...p, startPoint: e.target.value }))} placeholder="Origin terminal" />
            <FormInput label="End Point"   id="r-end"   required value={form.endPoint}   onChange={e => setForm(p => ({ ...p, endPoint: e.target.value }))}   placeholder="Destination" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Distance"  id="r-dist"  value={form.distance}      onChange={e => setForm(p => ({ ...p, distance: e.target.value }))}      placeholder="28 km" />
            <FormInput label="Est. Time" id="r-time"  value={form.estimatedTime} onChange={e => setForm(p => ({ ...p, estimatedTime: e.target.value }))} placeholder="65 min" />
          </div>

          {/* Stops builder */}
          <div>
            <label className="input-label">Stops</label>
            <div className="flex gap-2 mb-2">
              <input value={stopInput} onChange={e => setStopInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addStop(); } }}
                className="input-field flex-1" placeholder="Type stop name and press Enter or click Add" />
              <button type="button" onClick={addStop} className="btn-secondary px-3">Add</button>
            </div>
            {form.stops?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.stops.map((s, i) => (
                  <span key={i} className="flex items-center gap-1.5 bg-navy-50 text-navy-700 text-xs font-medium px-3 py-1 rounded-full">
                    <MapPin size={10} />
                    {typeof s === 'string' ? s : s.name}
                    <button type="button" onClick={() => removeStop(i)} className="text-slate-400 hover:text-red-500 ml-0.5">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={closeModal} className="btn-outline">Cancel</button>
            <button type="submit" className="btn-primary">{modal === 'edit' ? 'Save Changes' : 'Create Route'}</button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!delConfirm} onClose={() => setDelConfirm(null)} title="Delete Route" size="sm">
        <p className="text-sm text-slate-600">This will permanently remove the route. Buses assigned to it will become unassigned.</p>
        <div className="flex justify-end gap-3 mt-5">
          <button onClick={() => setDelConfirm(null)} className="btn-outline">Cancel</button>
          <button onClick={() => { dispatch({ type:'DELETE_ROUTE', payload: delConfirm }); toast.success('Route deleted'); setDelConfirm(null); }} className="btn-danger">Delete</button>
        </div>
      </Modal>
    </div>
  );
}
