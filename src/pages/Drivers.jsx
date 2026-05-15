import { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Phone, CreditCard, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';
import { driverAPI } from '../services/api';
import PageHeader  from '../components/ui/PageHeader';
import DataTable   from '../components/ui/DataTable';
import Modal       from '../components/ui/Modal';
import SearchBar   from '../components/ui/SearchBar';
import { FormInput } from '../components/ui/FormInput';

const EMPTY = { name: '', phone: '', license_number: '' };

export default function Drivers() {
  const { state, dispatch } = useApp();
  const [search, setSearch]   = useState('');
  const [modal,  setModal]    = useState(null); // null | 'add' | 'edit'
  const [form,   setForm]     = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [delConfirm, setDelConfirm] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const drivers = state.drivers || [];

  // ── Filtered data ────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return drivers.filter(d => {
      return !search || [d.name, d.phone, d.license_number].some(f => f?.toLowerCase().includes(search.toLowerCase()));
    });
  }, [drivers, search]);

  // ── Handlers ─────────────────────────────────────────────────────
  const openAdd = () => { setForm(EMPTY); setEditing(null); setModal('add'); };
  const openEdit = (d) => { setForm({ ...d }); setEditing(d.id); setModal('edit'); };
  const closeModal = () => { setModal(null); setForm(EMPTY); setEditing(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.license_number) {
      toast.error('Please fill required fields'); return;
    }
    
    setIsSubmitting(true);
    try {
      if (editing) {
        dispatch({ type: 'UPDATE_DRIVER_OPTIMISTIC', payload: { ...form, id: editing } });
        await driverAPI.update(editing, form);
        toast.success('Driver updated successfully');
      } else {
        const newDriver = await driverAPI.create(form);
        dispatch({ type: 'ADD_DRIVER_OPTIMISTIC', payload: newDriver });
        toast.success('Driver added successfully');
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
      dispatch({ type: 'DELETE_DRIVER_OPTIMISTIC', payload: delConfirm });
      await driverAPI.remove(delConfirm);
      toast.success('Driver removed');
    } catch (err) {
      toast.error('Failed to delete: ' + err.message);
    } finally {
      setDelConfirm(null);
    }
  };

  // ── Table columns ─────────────────────────────────────────────────
  const columns = useMemo(() => [
    { accessorKey: 'name',    header: 'Name',    cell: ({ getValue }) => (
        <p className="font-semibold text-navy-900">{getValue()}</p>
      )
    },
    { accessorKey: 'phone',   header: 'Phone Number', cell: ({ getValue }) => (
        <span className="flex items-center gap-1.5 text-xs text-slate-600"><Phone size={11} />{getValue()}</span>
      )
    },
    { accessorKey: 'license_number', header: 'License', cell: ({ getValue }) => (
        <span className="flex items-center gap-1.5 text-xs font-mono"><CreditCard size={11} />{getValue()}</span>
      )
    },
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

  if (state.loading.initial) {
    return <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="page-container">
      <PageHeader title="Driver Management" subtitle={`${drivers.length} drivers registered`} breadcrumb={['Drivers']}>
        <button className="btn-primary" onClick={openAdd}><Plus size={16} /> Add Driver</button>
      </PageHeader>

      {/* Table card */}
      <div className="section-card space-y-4 mt-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by name, phone, license…" className="flex-1" />
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
          <FormInput label="License Number" id="d-license" required value={form.license_number} onChange={e => setForm(p => ({ ...p, license_number: e.target.value }))} placeholder="KA01-20190012" />
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={closeModal} className="btn-outline" disabled={isSubmitting}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (modal === 'edit' ? 'Save Changes' : 'Add Driver')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!delConfirm} onClose={() => setDelConfirm(null)} title="Delete Driver" size="sm">
        <div className="flex flex-col items-center text-center gap-3 pt-2">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                <AlertCircle size={24} />
            </div>
            <p className="text-sm text-slate-600">Are you sure you want to remove this driver? This action cannot be undone.</p>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setDelConfirm(null)} className="btn-outline">Cancel</button>
          <button onClick={handleDelete} className="btn-danger">Delete</button>
        </div>
      </Modal>
    </div>
  );
}
