import { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Phone, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';
import PageHeader  from '../components/ui/PageHeader';
import DataTable   from '../components/ui/DataTable';
import StatusBadge from '../components/ui/StatusBadge';
import Modal       from '../components/ui/Modal';
import SearchBar   from '../components/ui/SearchBar';
import { FormInput, FormSelect } from '../components/ui/FormInput';

const EMPTY = { name:'', phone:'', license:'', address:'', assignedBus:'', status:'Active' };

export default function Drivers() {
  const { state, dispatch } = useApp();
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState('All');
  const [modal,  setModal]    = useState(null); // null | 'add' | 'edit'
  const [form,   setForm]     = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [delConfirm, setDelConfirm] = useState(null);

  // ── Filtered data ────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return state.drivers.filter(d => {
      const matchSearch = !search || [d.name, d.phone, d.license, d.id].some(f => f?.toLowerCase().includes(search.toLowerCase()));
      const matchFilter = filter === 'All' || d.status === filter;
      return matchSearch && matchFilter;
    });
  }, [state.drivers, search, filter]);

  // ── Handlers ─────────────────────────────────────────────────────
  const openAdd = () => { setForm(EMPTY); setEditing(null); setModal('add'); };
  const openEdit = (d) => { setForm({ ...d }); setEditing(d.id); setModal('edit'); };
  const closeModal = () => { setModal(null); setForm(EMPTY); setEditing(null); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.license) {
      toast.error('Please fill required fields'); return;
    }
    if (editing) {
      dispatch({ type: 'UPDATE_DRIVER', payload: { ...form, id: editing } });
      toast.success('Driver updated successfully');
    } else {
      dispatch({ type: 'ADD_DRIVER', payload: form });
      toast.success('Driver added successfully');
    }
    closeModal();
  };

  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_DRIVER', payload: id });
    toast.success('Driver removed');
    setDelConfirm(null);
  };

  // ── Table columns ─────────────────────────────────────────────────
  const columns = useMemo(() => [
    { accessorKey: 'id',      header: 'ID',      size: 80 },
    { accessorKey: 'name',    header: 'Name',    cell: ({ row }) => (
        <div>
          <p className="font-semibold text-navy-900">{row.original.name}</p>
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><Phone size={10} />{row.original.phone}</p>
        </div>
      )
    },
    { accessorKey: 'license', header: 'License', cell: ({ getValue }) => (
        <span className="flex items-center gap-1.5 text-xs font-mono"><CreditCard size={11} />{getValue()}</span>
      )
    },
    { accessorKey: 'assignedBus', header: 'Assigned Bus', cell: ({ getValue }) => (
        getValue() ? <span className="badge badge-navy">{getValue()}</span> : <span className="text-slate-400 text-xs">—</span>
      )
    },
    { accessorKey: 'status', header: 'Status', cell: ({ getValue }) => <StatusBadge status={getValue()} /> },
    { accessorKey: 'trips',  header: 'Trips', cell: ({ getValue }) => <span className="font-semibold">{getValue()}</span> },
    {
      id: 'actions', header: '', size: 80,
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <button onClick={() => openEdit(row.original)} className="btn-ghost p-1.5"><Edit2 size={14} /></button>
          <button onClick={() => setDelConfirm(row.original.id)} className="btn-ghost p-1.5 hover:!bg-red-50 hover:!text-red-500"><Trash2 size={14} /></button>
        </div>
      ),
    },
  ], []);

  const STATUS_FILTERS = ['All', 'Active', 'On Leave', 'Inactive', 'Training'];

  return (
    <div className="page-container">
      <PageHeader title="Driver Management" subtitle={`${state.drivers.length} drivers registered`} breadcrumb={['Drivers']}>
        <button className="btn-primary" onClick={openAdd}><Plus size={16} /> Add Driver</button>
      </PageHeader>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {STATUS_FILTERS.filter(f => f !== 'All').map(s => (
          <div key={s} className="glass-card p-4 cursor-pointer hover:shadow-glass-lg transition-shadow" onClick={() => setFilter(s)}>
            <p className="text-xs text-slate-500 font-medium">{s}</p>
            <p className="text-2xl font-bold text-navy-900 mt-1">{state.drivers.filter(d => d.status === s).length}</p>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="section-card space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by name, phone, license…" className="flex-1" />
          <div className="flex gap-2 flex-wrap">
            {STATUS_FILTERS.map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === s ? 'bg-navy-900 text-white' : 'bg-slate-100 text-navy-600 hover:bg-slate-200'}`}
              >{s}</button>
            ))}
          </div>
        </div>
        <DataTable columns={columns} data={filtered} searchValue={search} />
      </div>

      {/* Add / Edit Modal */}
      <Modal open={!!modal} onClose={closeModal} title={modal === 'edit' ? 'Edit Driver' : 'Add New Driver'} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Full Name"      id="d-name"    required value={form.name}    onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Ramesh Kumar" />
            <FormInput label="Phone Number"   id="d-phone"   required value={form.phone}   onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="9876543210" />
          </div>
          <FormInput label="License Number" id="d-license" required value={form.license} onChange={e => setForm(p => ({ ...p, license: e.target.value }))} placeholder="KA01-20190012" />
          <FormInput label="Address"        id="d-address"        value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} placeholder="12, MG Road, Bengaluru" />
          <div className="grid grid-cols-2 gap-4">
            <FormSelect label="Assigned Bus" id="d-bus" value={form.assignedBus} onChange={e => setForm(p => ({ ...p, assignedBus: e.target.value }))}>
              <option value="">— None —</option>
              {state.buses.map(b => <option key={b.id} value={b.id}>{b.id}</option>)}
            </FormSelect>
            <FormSelect label="Status" id="d-status" required value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
              {['Active','Inactive','On Leave','Training'].map(s => <option key={s}>{s}</option>)}
            </FormSelect>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={closeModal} className="btn-outline">Cancel</button>
            <button type="submit" className="btn-primary">{modal === 'edit' ? 'Save Changes' : 'Add Driver'}</button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!delConfirm} onClose={() => setDelConfirm(null)} title="Delete Driver" size="sm">
        <p className="text-sm text-slate-600">Are you sure you want to remove this driver? This action cannot be undone.</p>
        <div className="flex justify-end gap-3 mt-5">
          <button onClick={() => setDelConfirm(null)} className="btn-outline">Cancel</button>
          <button onClick={() => handleDelete(delConfirm)} className="btn-danger">Delete</button>
        </div>
      </Modal>
    </div>
  );
}
