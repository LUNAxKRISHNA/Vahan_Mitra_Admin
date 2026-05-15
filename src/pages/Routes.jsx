import { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, ArrowRight, AlertCircle, ChevronUp, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { routeAPI } from '../services/api';
import PageHeader from '../components/ui/PageHeader';
import Modal      from '../components/ui/Modal';
import SearchBar  from '../components/ui/SearchBar';
import { FormInput } from '../components/ui/FormInput';

const EMPTY = { route_name: '', estimated_duration: '', route_stops: [] };
const EMPTY_STOP = { stop_name: '', arrival_time: '', lat: '', long: '' };

export default function Routes() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [search,     setSearch]     = useState('');
  const [modal,      setModal]      = useState(null);
  const [form,       setForm]       = useState(EMPTY);
  const [editing,    setEditing]    = useState(null);
  const [delConfirm, setDelConfirm] = useState(null);
  const [stopInput,  setStopInput]  = useState(EMPTY_STOP);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const routes = state.routes || [];

  const filtered = useMemo(() =>
    routes.filter(r => !search || r.route_name?.toLowerCase().includes(search.toLowerCase())),
    [routes, search]
  );

  const openAdd  = () => { setForm(EMPTY); setEditing(null); setModal('add'); };
  const openEdit = (r) => { 
    setForm({ ...r, route_stops: r.route_stops || [] }); 
    setEditing(r.id); 
    setModal('edit'); 
  };
  const closeModal = () => { setModal(null); setForm(EMPTY); setEditing(null); setStopInput(EMPTY_STOP); };

  const addStop = () => {
    if (!stopInput.stop_name.trim()) { toast.error('Stop name is required'); return; }
    setForm(p => ({ 
      ...p, 
      route_stops: [...(p.route_stops || []), { 
        ...stopInput, 
        stop_name: stopInput.stop_name.trim(),
        stop_order: (p.route_stops?.length || 0) + 1 
      }] 
    }));
    setStopInput(EMPTY_STOP);
  };
  
  const removeStop = (i) => setForm(p => ({ 
    ...p, 
    route_stops: p.route_stops.filter((_, idx) => idx !== i).map((s, idx) => ({...s, stop_order: idx + 1})) 
  }));

  const moveStop = (index, direction) => {
    setForm(p => {
      const stops = [...p.route_stops];
      if (direction === 'up' && index > 0) {
        [stops[index - 1], stops[index]] = [stops[index], stops[index - 1]];
      } else if (direction === 'down' && index < stops.length - 1) {
        [stops[index + 1], stops[index]] = [stops[index], stops[index + 1]];
      }
      return { ...p, route_stops: stops.map((s, i) => ({ ...s, stop_order: i + 1 })) };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.route_name) { toast.error('Fill required fields'); return; }
    
    setIsSubmitting(true);
    try {
      const routeData = { route_name: form.route_name, estimated_duration: form.estimated_duration };
      
      if (editing) {
        await routeAPI.updateRouteWithStops(editing, routeData, form.route_stops);
        toast.success('Route updated');
      } else {
        await routeAPI.createRouteWithStops(routeData, form.route_stops);
        toast.success('Route created');
      }
      closeModal();
    } catch (err) {
      toast.error('Operation failed: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await routeAPI.removeRoute(delConfirm);
      toast.success('Route deleted');
    } catch(err) {
      toast.error('Failed to delete: ' + err.message);
    } finally {
      setDelConfirm(null);
    }
  };

  if (state.loading.initial) {
    return <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="page-container">
      <PageHeader title="Route Management" subtitle={`${routes.length} routes configured`} breadcrumb={['Routes']}>
        <button className="btn-primary" onClick={openAdd}><Plus size={16}/> Add Route</button>
      </PageHeader>

      <SearchBar value={search} onChange={setSearch} placeholder="Search routes…" className="max-w-sm mt-6" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
        {filtered.map((route, i) => {
          const startPoint = route.route_stops?.[0]?.stop_name || 'Unknown Start';
          const endPoint = route.route_stops?.[route.route_stops.length - 1]?.stop_name || 'Unknown End';
          
          return (
            <motion.div
              key={route.id || i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => navigate(`/routes/${route.id}`)}
              className="glass-card p-5 space-y-4 hover:shadow-glass-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-navy-900 text-sm font-bold leading-tight">{route.route_name}</h3>
                </div>
                <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                  <button onClick={() => openEdit(route)} className="btn-ghost p-1.5"><Edit2 size={13}/></button>
                  <button onClick={() => setDelConfirm(route.id)} className="btn-ghost p-1.5 hover:!bg-red-50 hover:!text-red-500"><Trash2 size={13}/></button>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-navy-600 shrink-0" />
                  <span className="truncate">{startPoint}</span>
                </div>
                <div className="ml-1 pl-[3px] border-l-2 border-dashed border-slate-200 py-1 text-slate-400 text-[10px]">
                  {route.route_stops?.length > 2 ? `${route.route_stops.length - 2} intermediate stops` : 'Direct'}
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-teal-600 shrink-0" />
                  <span className="truncate">{endPoint}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 rounded-lg p-2 text-center border border-slate-100">
                  <p className="text-slate-400 text-[10px]">Est. Duration</p>
                  <p className="font-bold text-navy-900">{route.estimated_duration || '—'}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2 text-center border border-slate-100">
                  <p className="text-slate-400 text-[10px]">Total Stops</p>
                  <p className="font-bold text-navy-900">{route.route_stops?.length || 0}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <Modal open={!!modal} onClose={closeModal} title={modal === 'edit' ? 'Edit Route' : 'Add New Route'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Route Name" id="r-name" required value={form.route_name} onChange={e => setForm(p => ({ ...p, route_name: e.target.value }))} placeholder="E.g. Express 42" />
            <FormInput label="Estimated Duration" id="r-time"  value={form.estimated_duration || ''} onChange={e => setForm(p => ({ ...p, estimated_duration: e.target.value }))} placeholder="E.g. 1 hour 30 mins" />
          </div>

          <div className="border-t border-slate-100 pt-4">
            <label className="input-label mb-3 block">Route Stops</label>
            
            {/* Stops builder input */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <FormInput label="Stop Name" id="s-name" value={stopInput.stop_name} onChange={e => setStopInput(p => ({...p, stop_name: e.target.value}))} placeholder="E.g. Central Station" />
                <FormInput label="Arrival Time (Optional)" id="s-time" type="time" value={stopInput.arrival_time} onChange={e => setStopInput(p => ({...p, arrival_time: e.target.value}))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormInput label="Latitude (Optional)" id="s-lat" type="number" step="any" value={stopInput.lat} onChange={e => setStopInput(p => ({...p, lat: e.target.value}))} placeholder="E.g. 12.9716" />
                <FormInput label="Longitude (Optional)" id="s-long" type="number" step="any" value={stopInput.long} onChange={e => setStopInput(p => ({...p, long: e.target.value}))} placeholder="E.g. 77.5946" />
              </div>
              <button type="button" onClick={addStop} className="btn-secondary w-full justify-center">Add Stop to Route</button>
            </div>

            {/* Stops list */}
            {form.route_stops?.length > 0 ? (
              <div className="flex flex-col gap-2">
                {form.route_stops.sort((a,b) => a.stop_order - b.stop_order).map((s, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white border border-slate-200 px-3 py-2.5 rounded-lg shadow-sm">
                    {/* Reorder Buttons */}
                    <div className="flex flex-col gap-0.5">
                      <button type="button" onClick={() => moveStop(i, 'up')} disabled={i === 0} className="text-slate-400 hover:text-navy-600 disabled:opacity-30"><ChevronUp size={14}/></button>
                      <button type="button" onClick={() => moveStop(i, 'down')} disabled={i === form.route_stops.length - 1} className="text-slate-400 hover:text-navy-600 disabled:opacity-30"><ChevronDown size={14}/></button>
                    </div>
                    
                    <span className="w-6 h-6 rounded-full bg-navy-900 text-white flex items-center justify-center text-xs font-bold shrink-0">{s.stop_order}</span>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-navy-900 text-sm truncate">{s.stop_name}</p>
                      <div className="flex gap-3 text-[10px] text-slate-500 mt-0.5">
                        {s.arrival_time && <span>Time: {s.arrival_time}</span>}
                        {(s.lat || s.long) && <span>Loc: {s.lat}, {s.long}</span>}
                      </div>
                    </div>
                    
                    <button type="button" onClick={() => removeStop(i)} className="text-slate-400 hover:text-red-500 p-2 shrink-0"><Trash2 size={16}/></button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 text-sm">
                No stops added yet.
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={closeModal} className="btn-outline" disabled={isSubmitting}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : (modal === 'edit' ? 'Save Changes' : 'Create Route')}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={!!delConfirm} onClose={() => setDelConfirm(null)} title="Delete Route" size="sm">
        <div className="flex flex-col items-center text-center gap-3 pt-2">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                <AlertCircle size={24} />
            </div>
            <p className="text-sm text-slate-600">This will permanently remove the route and all associated stops.</p>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setDelConfirm(null)} className="btn-outline">Cancel</button>
          <button onClick={handleDelete} className="btn-danger">Delete</button>
        </div>
      </Modal>
    </div>
  );
}
