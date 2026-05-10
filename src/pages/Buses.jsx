import { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Bus as BusIcon, Fuel } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';
import PageHeader  from '../components/ui/PageHeader';
import DataTable   from '../components/ui/DataTable';
import StatusBadge from '../components/ui/StatusBadge';
import Modal       from '../components/ui/Modal';
import SearchBar   from '../components/ui/SearchBar';
import { FormInput, FormSelect } from '../components/ui/FormInput';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const EMPTY = { regNumber:'', capacity:'', routeId:'', driverId:'', status:'Active', year:'', fuel:'Diesel' };
const STATUS_COLORS = { Active:'bg-emerald-400', Idle:'bg-navy-400', Maintenance:'bg-amber-400', Inactive:'bg-red-400' };

export default function Buses() {
  const { state, dispatch } = useApp();
  const [search,     setSearch]     = useState('');
  const [filter,     setFilter]     = useState('All');
  const [modal,      setModal]      = useState(null);
  const [form,       setForm]       = useState(EMPTY);
  const [editing,    setEditing]    = useState(null);
  const [delConfirm, setDelConfirm] = useState(null);
  const [view,       setView]       = useState('table'); // 'table' | 'cards'

  const filtered = useMemo(() => state.buses.filter(b => {
    const m = !search || [b.id, b.regNumber].some(f => f?.toLowerCase().includes(search.toLowerCase()));
    const f = filter === 'All' || b.status === filter;
    return m && f;
  }), [state.buses, search, filter]);

  const openAdd  = () => { setForm(EMPTY); setEditing(null); setModal('add'); };
  const openEdit = (b) => { setForm({ ...b }); setEditing(b.id); setModal('edit'); };
  const closeModal = () => { setModal(null); setForm(EMPTY); setEditing(null); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.regNumber || !form.capacity) { toast.error('Fill required fields'); return; }
    if (editing) {
      dispatch({ type: 'UPDATE_BUS', payload: { ...form, id: editing } });
      toast.success('Bus updated');
    } else {
      dispatch({ type: 'ADD_BUS', payload: form });
      toast.success('Bus added');
    }
    closeModal();
  };

  const columns = useMemo(() => [
    { accessorKey: 'id',        header: 'Bus ID', cell: ({ getValue }) => <span className="font-bold text-navy-900">{getValue()}</span> },
    { accessorKey: 'regNumber', header: 'Reg No.' },
    { accessorKey: 'capacity',  header: 'Seats',  cell: ({ getValue }) => <span className="font-semibold">{getValue()}</span> },
    { accessorKey: 'fuel',      header: 'Fuel',   cell: ({ getValue }) => (
        <span className="flex items-center gap-1.5 text-xs"><Fuel size={11} />{getValue()}</span>
      )
    },
    { accessorKey: 'routeId',   header: 'Route',  cell: ({ getValue }) => getValue()
        ? <span className="badge badge-blue">{getValue()}</span>
        : <span className="text-slate-400 text-xs">Unassigned</span>
    },
    { accessorKey: 'driverId',  header: 'Driver', cell: ({ getValue }) => {
        const d = state.drivers.find(x => x.id === getValue());
        return d ? <span className="text-sm">{d.name}</span> : <span className="text-slate-400 text-xs">—</span>;
      }
    },
    { accessorKey: 'status', header: 'Status', cell: ({ getValue }) => <StatusBadge status={getValue()} /> },
    {
      id: 'actions', header: '', size: 80,
      cell: ({ row }) => (
        <div className="flex gap-1">
          <button onClick={() => openEdit(row.original)} className="btn-ghost p-1.5"><Edit2 size={14} /></button>
          <button onClick={() => setDelConfirm(row.original.id)} className="btn-ghost p-1.5 hover:!bg-red-50 hover:!text-red-500"><Trash2 size={14} /></button>
        </div>
      ),
    },
  ], [state.drivers]);

  const STATUS_FILTERS = ['All', 'Active', 'Idle', 'Maintenance', 'Inactive'];

  return (
    <div className="page-container">
      <PageHeader title="Bus Management" subtitle={`${state.buses.length} buses in fleet`} breadcrumb={['Buses']}>
        <div className="flex gap-2">
          {['table','cards'].map(v => (
            <button key={v} onClick={() => setView(v)} className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors', view === v ? 'bg-navy-900 text-white' : 'btn-outline')}>
              {v}
            </button>
          ))}
          <button className="btn-primary" onClick={openAdd}><Plus size={16} /> Add Bus</button>
        </div>
      </PageHeader>

      {/* Status summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {STATUS_FILTERS.filter(f => f !== 'All').map(s => {
          const count = state.buses.filter(b => b.status === s).length;
          return (
            <div key={s} className="glass-card p-4 flex items-center gap-3 cursor-pointer hover:shadow-glass-lg transition-shadow" onClick={() => setFilter(s)}>
              <div className={clsx('w-3 h-3 rounded-full shrink-0', STATUS_COLORS[s])} />
              <div>
                <p className="text-xs text-slate-500">{s}</p>
                <p className="text-xl font-bold text-navy-900">{count}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter + Search */}
      <div className="section-card space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by bus ID or reg number…" className="flex-1" />
          <div className="flex gap-2 flex-wrap">
            {STATUS_FILTERS.map(s => (
              <button key={s} onClick={() => setFilter(s)} className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors', filter === s ? 'bg-navy-900 text-white' : 'bg-slate-100 text-navy-600 hover:bg-slate-200')}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Views */}
        {view === 'table' ? (
          <DataTable columns={columns} data={filtered} searchValue={search} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((bus, i) => {
              const driver = state.drivers.find(d => d.id === bus.driverId);
              return (
                <motion.div key={bus.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  className="glass-card p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center">
                        <BusIcon size={18} className="text-navy-600" />
                      </div>
                      <div>
                        <p className="font-bold text-navy-900">{bus.id}</p>
                        <p className="text-xs text-slate-500">{bus.regNumber}</p>
                      </div>
                    </div>
                    <StatusBadge status={bus.status} />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50 rounded-lg p-2"><p className="text-slate-500">Capacity</p><p className="font-semibold text-navy-900">{bus.capacity} seats</p></div>
                    <div className="bg-slate-50 rounded-lg p-2"><p className="text-slate-500">Fuel</p><p className="font-semibold text-navy-900">{bus.fuel}</p></div>
                    <div className="bg-slate-50 rounded-lg p-2"><p className="text-slate-500">Route</p><p className="font-semibold text-navy-900">{bus.routeId ?? '—'}</p></div>
                    <div className="bg-slate-50 rounded-lg p-2"><p className="text-slate-500">Driver</p><p className="font-semibold text-navy-900 truncate">{driver?.name ?? '—'}</p></div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => openEdit(bus)} className="btn-outline flex-1 text-xs py-1.5"><Edit2 size={12}/> Edit</button>
                    <button onClick={() => setDelConfirm(bus.id)} className="btn-danger flex-1 text-xs py-1.5"><Trash2 size={12}/> Delete</button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal open={!!modal} onClose={closeModal} title={modal === 'edit' ? 'Edit Bus' : 'Add New Bus'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Registration Number" id="b-reg" required value={form.regNumber} onChange={e => setForm(p => ({ ...p, regNumber: e.target.value }))} placeholder="KA01-F-1234" />
            <FormInput label="Seating Capacity" id="b-cap" type="number" required value={form.capacity} onChange={e => setForm(p => ({ ...p, capacity: e.target.value }))} placeholder="52" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Year of Manufacture" id="b-year" type="number" value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))} placeholder="2022" />
            <FormSelect label="Fuel Type" id="b-fuel" value={form.fuel} onChange={e => setForm(p => ({ ...p, fuel: e.target.value }))}>
              {['Diesel','CNG','Electric','Hybrid'].map(f => <option key={f}>{f}</option>)}
            </FormSelect>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormSelect label="Assigned Route" id="b-route" value={form.routeId} onChange={e => setForm(p => ({ ...p, routeId: e.target.value }))}>
              <option value="">— None —</option>
              {state.routes.map(r => <option key={r.id} value={r.id}>{r.id} – {r.name.substring(0,20)}</option>)}
            </FormSelect>
            <FormSelect label="Assigned Driver" id="b-driver" value={form.driverId} onChange={e => setForm(p => ({ ...p, driverId: e.target.value }))}>
              <option value="">— None —</option>
              {state.drivers.filter(d => d.status === 'Active').map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </FormSelect>
          </div>
          <FormSelect label="Operational Status" id="b-status" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
            {['Active','Idle','Maintenance','Inactive'].map(s => <option key={s}>{s}</option>)}
          </FormSelect>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={closeModal} className="btn-outline">Cancel</button>
            <button type="submit" className="btn-primary">{modal === 'edit' ? 'Save Changes' : 'Add Bus'}</button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!delConfirm} onClose={() => setDelConfirm(null)} title="Delete Bus" size="sm">
        <p className="text-sm text-slate-600">Remove this bus from the fleet? This cannot be undone.</p>
        <div className="flex justify-end gap-3 mt-5">
          <button onClick={() => setDelConfirm(null)} className="btn-outline">Cancel</button>
          <button onClick={() => { dispatch({ type:'DELETE_BUS', payload: delConfirm }); toast.success('Bus removed'); setDelConfirm(null); }} className="btn-danger">Delete</button>
        </div>
      </Modal>
    </div>
  );
}
