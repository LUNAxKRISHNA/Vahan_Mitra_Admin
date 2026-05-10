import { useState } from 'react';
import { useApp } from '../context/AppContext';
import PageHeader       from '../components/ui/PageHeader';
import ActivityTimeline from '../components/ui/ActivityTimeline';
import SearchBar        from '../components/ui/SearchBar';
import clsx from 'clsx';

const TYPE_LABELS = ['All', 'create', 'update', 'delete', 'notify'];

export default function ActivityLogs() {
  const { state }     = useApp();
  const [search,      setSearch]      = useState('');
  const [typeFilter,  setTypeFilter]  = useState('All');
  const [dateFilter,  setDateFilter]  = useState('');

  const filtered = state.activityLogs.filter(log => {
    const matchSearch = !search || log.action.toLowerCase().includes(search.toLowerCase()) || log.description.toLowerCase().includes(search.toLowerCase());
    const matchType   = typeFilter === 'All' || log.type === typeFilter;
    const matchDate   = !dateFilter || log.timestamp.startsWith(dateFilter);
    return matchSearch && matchType && matchDate;
  });

  return (
    <div className="page-container">
      <PageHeader title="Activity Logs" subtitle={`${state.activityLogs.length} total recorded actions`} breadcrumb={['Activity Logs']} />

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Created',  type: 'create', color: 'bg-emerald-100 text-emerald-700' },
          { label: 'Updated',  type: 'update', color: 'bg-blue-100 text-blue-700'      },
          { label: 'Deleted',  type: 'delete', color: 'bg-red-100 text-red-700'        },
          { label: 'Notified', type: 'notify', color: 'bg-amber-100 text-amber-700'    },
        ].map(({ label, type, color }) => (
          <div key={type} className={clsx('glass-card p-4 cursor-pointer hover:shadow-glass-lg transition-shadow')} onClick={() => setTypeFilter(type)}>
            <p className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full inline-block mb-2', color)}>{label}</p>
            <p className="text-2xl font-bold text-navy-900">{state.activityLogs.filter(l => l.type === type).length}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="section-card space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Search actions or descriptions…" className="flex-1" />
          <input
            type="date"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            className="input-field w-auto"
          />
          <div className="flex gap-2 flex-wrap">
            {TYPE_LABELS.map(t => (
              <button key={t} onClick={() => setTypeFilter(t)} className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors', typeFilter === t ? 'bg-navy-900 text-white' : 'bg-slate-100 text-navy-600 hover:bg-slate-200')}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-500">{filtered.length} entries matching filters</p>

        <ActivityTimeline logs={filtered} />
      </div>
    </div>
  );
}
