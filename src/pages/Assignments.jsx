import { useState } from 'react';
import { Plus, GitBranch } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';
import { assignmentAPI } from '../services/api';
import PageHeader    from '../components/ui/PageHeader';
import AssignmentCard from '../components/ui/AssignmentCard';
import Modal         from '../components/ui/Modal';
import { FormSelect } from '../components/ui/FormInput';

const EMPTY = { driver_id: '', bus_id: '', route_id: '' };

export default function Assignments() {
  const { state, dispatch } = useApp();
  const [modal,   setModal]   = useState(null); // null | 'add' | 'edit'
  const [form,    setForm]    = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const assignments = state.assignments || [];

  const openAdd = () => { setForm(EMPTY); setEditing(null); setModal('add'); };
  const openEdit = (a) => { setForm({ ...a }); setEditing(a.id); setModal('edit'); };
  const closeModal = () => { setModal(null); setForm(EMPTY); setEditing(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.driver_id || !form.bus_id || !form.route_id) { toast.error('Select driver, bus and route'); return; }
    
    setIsSubmitting(true);
    try {
      if (editing) {
        await assignmentAPI.update(editing, form);
        toast.success('Assignment updated');
      } else {
        await assignmentAPI.create(form);
        toast.success('Assignment created');
      }
      closeModal();
    } catch (err) {
      toast.error('Operation failed: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await assignmentAPI.remove(id);
      toast.success('Assignment removed');
    } catch (err) {
      toast.error('Failed to remove: ' + err.message);
    }
  };

  if (state.loading.initial) {
    return <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="page-container">
      <PageHeader title="Assignment Management" subtitle={`${assignments.length} assignments configured`} breadcrumb={['Assignments']}>
        <button className="btn-primary" onClick={openAdd}><Plus size={16}/> New Assignment</button>
      </PageHeader>

      <div className="mt-8">
        {assignments.length === 0 ? (
          <div className="section-card flex flex-col items-center py-12 text-center">
            <GitBranch size={40} className="text-slate-200 mb-3" />
            <p className="text-navy-700 font-semibold">No assignments found</p>
            <p className="text-sm text-slate-500 mt-1">Create a new assignment to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {assignments.map((a, i) => (
              <AssignmentCard
                key={a.id || i}
                assignment={a}
                driver={state.drivers?.find(d => d.id === a.driver_id)}
                bus={state.buses?.find(b => b.id === a.bus_id)}
                route={state.routes?.find(r => r.id === a.route_id)}
                index={i}
                onDelete={handleDelete}
                onEdit={openEdit}
              />
            ))}
          </div>
        )}
      </div>

      <Modal open={!!modal} onClose={closeModal} title={modal === 'edit' ? 'Edit Assignment' : 'Create New Assignment'} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormSelect label="Driver" id="a-driver" required value={form.driver_id} onChange={e => setForm(p => ({ ...p, driver_id: e.target.value }))}>
            <option value="">— Select Driver —</option>
            {state.drivers?.map(d => (
              <option key={d.id} value={d.id}>{d.name} ({d.phone})</option>
            ))}
          </FormSelect>
          
          <FormSelect label="Bus" id="a-bus" required value={form.bus_id} onChange={e => setForm(p => ({ ...p, bus_id: e.target.value }))}>
            <option value="">— Select Bus —</option>
            {state.buses?.map(b => (
              <option key={b.id} value={b.id}>{b.bus_no} – {b.name || b.reg_number}</option>
            ))}
          </FormSelect>
          
          <FormSelect label="Route" id="a-route" required value={form.route_id} onChange={e => setForm(p => ({ ...p, route_id: e.target.value }))}>
            <option value="">— Select Route —</option>
            {state.routes?.map(r => (
              <option key={r.id} value={r.id}>{r.route_name}</option>
            ))}
          </FormSelect>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={closeModal} className="btn-outline" disabled={isSubmitting}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (modal === 'edit' ? 'Save Changes' : 'Create Assignment')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
