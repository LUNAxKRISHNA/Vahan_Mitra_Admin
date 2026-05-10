import { useState } from 'react';
import { Send, Bell, AlertTriangle, Users, Route, Bus, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';
import PageHeader      from '../components/ui/PageHeader';
import NotificationCard from '../components/ui/NotificationCard';
import SearchBar       from '../components/ui/SearchBar';
import { FormInput, FormSelect, FormTextarea } from '../components/ui/FormInput';
import clsx from 'clsx';

const TARGET_TYPES = [
  { value: 'All Users',  icon: Users,         label: 'All Users'  },
  { value: 'Route',      icon: Route,         label: 'By Route'   },
  { value: 'Bus',        icon: Bus,           label: 'By Bus'     },
  { value: 'Driver',     icon: User,          label: 'By Driver'  },
];

const TEMPLATES = [
  { label: 'Route Diversion',  type: 'Alert',     title: 'Route Diversion Alert',   message: 'Due to road conditions, Route [X] has been diverted. Please use alternate routes.' },
  { label: 'Bus Breakdown',    type: 'Emergency', title: 'Bus Breakdown Notice',    message: 'Bus [X] is currently under maintenance. We apologize for the inconvenience.' },
  { label: 'Schedule Update',  type: 'Info',      title: 'Schedule Update',         message: 'Bus schedules have been updated effective [DATE]. Please check the app for details.' },
  { label: 'Emergency Alert',  type: 'Emergency', title: 'Emergency Alert',         message: 'There is an emergency situation. Please follow instructions from local authorities.' },
  { label: 'Holiday Schedule', type: 'Info',      title: 'Holiday Schedule Notice', message: 'Buses will operate on a holiday timetable on [DATE]. Check app for timings.' },
];

const EMPTY_FORM = { title:'', message:'', target:'All Users', type:'Info', targetId:'' };

export default function Notifications() {
  const { state, dispatch } = useApp();
  const [form,   setForm]   = useState(EMPTY_FORM);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [emergency, setEmergency] = useState(false);

  const filtered = state.notifications.filter(n => {
    const m = !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.message.toLowerCase().includes(search.toLowerCase());
    const t = typeFilter === 'All' || n.type === typeFilter;
    return m && t;
  });

  const applyTemplate = (tpl) => {
    setForm(p => ({ ...p, title: tpl.title, message: tpl.message, type: tpl.type }));
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!form.title || !form.message) { toast.error('Title and message are required'); return; }
    const targetLabel = form.target === 'All Users' ? 'All Users'
      : form.target === 'Route'  ? (form.targetId ? `Route ${form.targetId}` : 'All Routes')
      : form.target === 'Bus'    ? (form.targetId ? `Bus ${form.targetId}` : 'All Buses')
      : (form.targetId ? `Driver ${form.targetId}` : 'All Drivers');
    dispatch({ type: 'SEND_NOTIFICATION', payload: { ...form, target: targetLabel, type: emergency ? 'Emergency' : form.type } });
    toast.success('Notification sent!');
    setForm(EMPTY_FORM); setEmergency(false);
  };

  return (
    <div className="page-container">
      <PageHeader title="Notification Center" subtitle="Send and manage passenger notifications" breadcrumb={['Notifications']} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compose Panel */}
        <div className="lg:col-span-1">
          <div className="section-card space-y-5 sticky top-24">
            <div className="flex items-center justify-between">
              <h3 className="text-navy-900">Compose</h3>
              {/* Emergency toggle */}
              <button
                onClick={() => setEmergency(v => !v)}
                className={clsx(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                  emergency ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600',
                )}
              >
                <AlertTriangle size={13}/> Emergency
              </button>
            </div>

            {emergency && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700 font-medium flex items-center gap-2">
                <AlertTriangle size={14}/> Emergency mode — notification will be sent to ALL users immediately.
              </div>
            )}

            {/* Templates */}
            <div>
              <p className="input-label mb-2">Quick Templates</p>
              <div className="flex flex-wrap gap-2">
                {TEMPLATES.map(t => (
                  <button key={t.label} onClick={() => applyTemplate(t)} className="px-2.5 py-1 rounded-lg bg-slate-100 text-navy-600 text-xs font-medium hover:bg-navy-100 transition-colors">
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSend} className="space-y-4">
              <FormInput label="Title" id="n-title" required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Notification title" />
              <FormTextarea label="Message" id="n-msg" required rows={4} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder="Enter your message…" />

              {!emergency && (
                <>
                  <div>
                    <p className="input-label mb-2">Send To</p>
                    <div className="grid grid-cols-2 gap-2">
                      {TARGET_TYPES.map(({ value, icon: Icon, label }) => (
                        <button
                          key={value} type="button"
                          onClick={() => setForm(p => ({ ...p, target: value, targetId: '' }))}
                          className={clsx(
                            'flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all',
                            form.target === value ? 'border-navy-900 bg-navy-50 text-navy-900' : 'border-slate-200 text-slate-500 hover:border-navy-300',
                          )}
                        >
                          <Icon size={13}/> {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {form.target !== 'All Users' && (
                    <FormSelect label={`Select ${form.target}`} id="n-tid" value={form.targetId} onChange={e => setForm(p => ({ ...p, targetId: e.target.value }))}>
                      <option value="">— All {form.target}s —</option>
                      {form.target === 'Route'  && state.routes.map(r  => <option key={r.id}  value={r.id}>{r.name}</option>)}
                      {form.target === 'Bus'    && state.buses.map(b   => <option key={b.id}  value={b.id}>{b.id}</option>)}
                      {form.target === 'Driver' && state.drivers.map(d => <option key={d.id}  value={d.id}>{d.name}</option>)}
                    </FormSelect>
                  )}

                  <FormSelect label="Type" id="n-type" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                    {['Info','Alert','Emergency'].map(t => <option key={t}>{t}</option>)}
                  </FormSelect>
                </>
              )}

              <button type="submit" className={clsx('w-full flex items-center justify-center gap-2', emergency ? 'btn-danger' : 'btn-primary')}>
                <Send size={15}/> {emergency ? 'Send Emergency Alert' : 'Send Notification'}
              </button>
            </form>
          </div>
        </div>

        {/* History */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <h3 className="text-navy-900">Notification History</h3>
            <div className="flex gap-2 flex-wrap ml-auto">
              {['All','Info','Alert','Emergency'].map(t => (
                <button key={t} onClick={() => setTypeFilter(t)} className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors', typeFilter === t ? 'bg-navy-900 text-white' : 'bg-slate-100 text-navy-600 hover:bg-slate-200')}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <SearchBar value={search} onChange={setSearch} placeholder="Search notifications…" />
          <div className="space-y-3">
            {filtered.map(n => <NotificationCard key={n.id} notif={n} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
