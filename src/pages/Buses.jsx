import { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Bus as BusIcon, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';
import { busAPI } from '../services/api';
import PageHeader  from '../components/ui/PageHeader';
import DataTable   from '../components/ui/DataTable';
import Modal       from '../components/ui/Modal';
import SearchBar   from '../components/ui/SearchBar';
import { FormInput } from '../components/ui/FormInput';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const EMPTY = { name: '', bus_no: '', reg_number: '', capacity: '' };

export default function Buses() {
  const { state, dispatch } = useApp();
  const [search,     setSearch]     = useState('');
  const [modal,      setModal]      = useState(null);
  const [form,       setForm]       = useState(EMPTY);
  const [editing,    setEditing]    = useState(null);
  const [delConfirm, setDelConfirm] = useState(null);
  const [view,       setView]       = useState('table'); // 'table' | 'cards'
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fallback to empty array if loading or undefined
  const buses = state.buses || [];

  const filtered = useMemo(() => buses.filter(b => {
    return !search || [b.name, b.bus_no, b.reg_number].some(f => f?.toString().toLowerCase().includes(search.toLowerCase()));
  }), [buses, search]);

  const openAdd  = () => { setForm(EMPTY); setEditing(null); setModal('add'); };
  const openEdit = (b) => { setForm({ ...b }); setEditing(b.id); setModal('edit'); };
  const closeModal = () => { setModal(null); setForm(EMPTY); setEditing(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.bus_no || !form.reg_number) { toast.error('Fill required fields'); return; }
    
    setIsSubmitting(true);
    try {
      if (editing) {
        // Optimistic update
        dispatch({ type: 'UPDATE_BUS_OPTIMISTIC', payload: { ...form, id: editing } });
        await busAPI.update(editing, form);
        toast.success('Bus updated');
      } else {
        // We don't have the ID yet, so we'll wait for the real-time sync or the API response
        const newBus = await busAPI.create(form);
        dispatch({ type: 'ADD_BUS_OPTIMISTIC', payload: newBus });
        toast.success('Bus added');
      }
      closeModal();
    } catch (err) {
      toast.error('Operation failed: ' + err.message);
      // In a robust app, we'd dispatch a rollback action here if optimistic update failed
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      dispatch({ type: 'DELETE_BUS_OPTIMISTIC', payload: delConfirm });
      await busAPI.remove(delConfirm);
      toast.success('Bus removed');
    } catch (err) {
      toast.error('Failed to delete: ' + err.message);
    } finally {
      setDelConfirm(null);
    }
  };

  const columns = useMemo(() => [
    { accessorKey: 'bus_no', header: 'Bus Number', cell: ({ getValue }) => <span className="font-bold text-navy-900">{getValue()}</span> },
    { accessorKey: 'name', header: 'Bus Name', cell: ({ getValue }) => <span className="font-semibold text-slate-700">{getValue() || '—'}</span> },
    { accessorKey: 'reg_number', header: 'Reg No.' },
    { accessorKey: 'capacity',  header: 'Seats',  cell: ({ getValue }) => <span className="font-semibold">{getValue()}</span> },
    {
      id: 'actions', header: '', size: 80,
      cell: ({ row }) => (
        <div className="flex gap-1">
          <button onClick={() => openEdit(row.original)} className="btn-ghost p-1.5"><Edit2 size={14} /></button>
          <button onClick={() => setDelConfirm(row.original.id)} className="btn-ghost p-1.5 hover:!bg-red-50 hover:!text-red-500"><Trash2 size={14} /></button>
        </div>
      ),
    },
  ], []);

  if (state.loading.initial) {
    return <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="page-container">
      <PageHeader title="Bus Management" subtitle={`${buses.length} buses in fleet`} breadcrumb={['Buses']}>
        <div className="flex gap-2">
          {['table','cards'].map(v => (
            <button key={v} onClick={() => setView(v)} className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors', view === v ? 'bg-navy-900 text-white' : 'btn-outline')}>
              {v}
            </button>
          ))}
          <button className="btn-primary" onClick={openAdd}><Plus size={16} /> Add Bus</button>
        </div>
      </PageHeader>

      {/* Filter + Search */}
      <div className="section-card space-y-4 mt-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by bus number or reg number…" className="flex-1" />
        </div>

        {/* Views */}
        {view === 'table' ? (
          <DataTable columns={columns} data={filtered} searchValue={search} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((bus, i) => {
              return (
                <motion.div key={bus.id || i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  className="glass-card p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center">
                        <BusIcon size={18} className="text-navy-600" />
                      </div>
                      <div>
                        <p className="font-bold text-navy-900 text-lg">Bus No: {bus.bus_no}</p>
                        <p className="text-sm font-semibold text-slate-700 mt-0.5">{bus.name || 'Unnamed Bus'}</p>
                        <p className="text-xs text-slate-500 mt-1">{bus.reg_number}</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2 text-xs">
                    <div className="bg-slate-50 rounded-lg p-2 flex justify-between">
                        <p className="text-slate-500">Capacity</p>
                        <p className="font-semibold text-navy-900">{bus.capacity} seats</p>
                    </div>
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
          <FormInput label="Bus Name" id="b-name" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="E.g. Volvo Intercity" />
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Bus Number" id="b-no" required value={form.bus_no} onChange={e => setForm(p => ({ ...p, bus_no: e.target.value }))} placeholder="101" />
            <FormInput label="Registration Number" id="b-reg" required value={form.reg_number} onChange={e => setForm(p => ({ ...p, reg_number: e.target.value }))} placeholder="KA01-F-1234" />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <FormInput label="Seating Capacity" id="b-cap" type="number" required value={form.capacity} onChange={e => setForm(p => ({ ...p, capacity: e.target.value }))} placeholder="52" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={closeModal} className="btn-outline" disabled={isSubmitting}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : (modal === 'edit' ? 'Save Changes' : 'Add Bus')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!delConfirm} onClose={() => setDelConfirm(null)} title="Delete Bus" size="sm">
        <div className="flex flex-col items-center text-center gap-3 pt-2">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                <AlertCircle size={24} />
            </div>
            <p className="text-sm text-slate-600">Remove this bus from the fleet? This cannot be undone.</p>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setDelConfirm(null)} className="btn-outline">Cancel</button>
          <button onClick={handleDelete} className="btn-danger">Delete</button>
        </div>
      </Modal>
    </div>
  );
}
