import { useState } from 'react';
import { Bell, Shield, Globe, Monitor, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '../components/ui/PageHeader';
import clsx from 'clsx';

// Toggle component
function Toggle({ checked, onChange, id }) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={clsx(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none',
        checked ? 'bg-teal-500' : 'bg-slate-200',
      )}
    >
      <span className={clsx(
        'inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200',
        checked ? 'translate-x-6' : 'translate-x-1',
      )} />
    </button>
  );
}

// Settings row
function SettingRow({ label, description, checked, onChange, id }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0">
      <div>
        <p className="text-sm font-medium text-navy-900">{label}</p>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
      <Toggle checked={checked} onChange={onChange} id={id} />
    </div>
  );
}

export default function Settings() {
  const [notifSettings, setNotifSettings] = useState({
    emailAlerts:      true,
    smsAlerts:        false,
    pushNotifs:       true,
    emergencyAlerts:  true,
    weeklyDigest:     false,
    driverUpdates:    true,
  });
  const [systemSettings, setSystemSettings] = useState({
    darkMode:         false,
    compactView:      false,
    autoRefresh:      true,
    showBreadcrumbs:  true,
  });

  const toggle = (group, key) => {
    if (group === 'notif') setNotifSettings(p => ({ ...p, [key]: !p[key] }));
    else setSystemSettings(p => ({ ...p, [key]: !p[key] }));
  };

  const save = () => toast.success('Settings saved');

  return (
    <div className="page-container">
      <PageHeader title="Settings" subtitle="Configure system preferences and notifications" breadcrumb={['Settings']}>
        <button onClick={save} className="btn-primary"><Save size={15}/> Save Settings</button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Settings */}
        <div className="section-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-navy-50 flex items-center justify-center">
              <Bell size={17} className="text-navy-600" />
            </div>
            <h3 className="text-navy-900">Notification Preferences</h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">Control how and when you receive alerts.</p>
          {[
            { key:'emailAlerts',     label:'Email Alerts',     description:'Receive admin alerts via email' },
            { key:'smsAlerts',       label:'SMS Alerts',       description:'Get critical alerts by SMS' },
            { key:'pushNotifs',      label:'Push Notifications',description:'Browser push notifications' },
            { key:'emergencyAlerts', label:'Emergency Alerts', description:'Always receive emergency notifications' },
            { key:'weeklyDigest',    label:'Weekly Digest',    description:'Summary email every Monday' },
            { key:'driverUpdates',   label:'Driver Updates',   description:'Notify on driver status changes' },
          ].map(({ key, label, description }) => (
            <SettingRow key={key} id={`n-${key}`} label={label} description={description} checked={notifSettings[key]} onChange={() => toggle('notif', key)} />
          ))}
        </div>

        {/* System Settings */}
        <div className="space-y-6">
          <div className="section-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
                <Monitor size={17} className="text-teal-600" />
              </div>
              <h3 className="text-navy-900">Display & Interface</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">Customize your dashboard experience.</p>
            {[
              { key:'darkMode',        label:'Dark Mode',         description:'Switch to dark theme (coming soon)' },
              { key:'compactView',     label:'Compact View',      description:'Reduce card and row padding' },
              { key:'autoRefresh',     label:'Auto Refresh',      description:'Refresh dashboard data every 5 min' },
              { key:'showBreadcrumbs', label:'Show Breadcrumbs',  description:'Display page path in navbar' },
            ].map(({ key, label, description }) => (
              <SettingRow key={key} id={`s-${key}`} label={label} description={description} checked={systemSettings[key]} onChange={() => toggle('system', key)} />
            ))}
          </div>

          {/* System info */}
          <div className="section-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                <Globe size={17} className="text-slate-600" />
              </div>
              <h3 className="text-navy-900">System Information</h3>
            </div>
            <div className="space-y-3">
              {[
                { label:'Application',  value:'Vahan Mitra Admin v1.0.0'  },
                { label:'Environment',  value:'Production'                 },
                { label:'Data Source',  value:'Supabase Database'          },
                { label:'Last Updated', value:new Date().toLocaleDateString('en-IN') },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0 text-sm">
                  <span className="text-slate-500">{label}</span>
                  <span className="font-semibold text-navy-900">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security */}
          <div className="section-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Shield size={17} className="text-emerald-600" />
              </div>
              <h3 className="text-navy-900">Security Status</h3>
            </div>
            <div className="space-y-2">
              {[
                { label:'Session Timeout',      status:'30 minutes',       ok:true  },
                { label:'Two-Factor Auth',       status:'Disabled',         ok:false },
                { label:'Last Login',            status:'Today, 09:15 AM',  ok:true  },
                { label:'Active Sessions',       status:'1 device',         ok:true  },
              ].map(({ label, status, ok }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0 text-sm">
                  <span className="text-slate-500">{label}</span>
                  <span className={clsx('font-semibold', ok ? 'text-emerald-600' : 'text-amber-600')}>{status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
