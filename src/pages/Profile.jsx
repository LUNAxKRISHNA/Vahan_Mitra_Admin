import { useState } from 'react';
import { UserCircle, Mail, Phone, MapPin, Shield, Edit2, Lock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { mockAdminProfile } from '../data/mockData';
import PageHeader from '../components/ui/PageHeader';
import { FormInput } from '../components/ui/FormInput';

export default function Profile() {
  const [profile, setProfile] = useState(mockAdminProfile);
  const [editing, setEditing] = useState(false);
  const [form,    setForm]    = useState({ ...mockAdminProfile });
  const [pwForm,  setPwForm]  = useState({ current:'', next:'', confirm:'' });
  const [pwMode,  setPwMode]  = useState(false);

  const saveProfile = (e) => {
    e.preventDefault();
    setProfile({ ...form });
    setEditing(false);
    toast.success('Profile updated');
  };

  const changePassword = (e) => {
    e.preventDefault();
    if (!pwForm.current) { toast.error('Enter current password'); return; }
    if (pwForm.next !== pwForm.confirm) { toast.error("New passwords don't match"); return; }
    if (pwForm.next.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    toast.success('Password changed successfully');
    setPwForm({ current:'', next:'', confirm:'' });
    setPwMode(false);
  };

  const INITIALS = profile.name.split(' ').map(n => n[0]).join('');

  return (
    <div className="page-container">
      <PageHeader title="Admin Profile" subtitle="Manage your account and security settings" breadcrumb={['Admin Profile']} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="section-card flex flex-col items-center text-center space-y-4">
          <div className="w-24 h-24 rounded-3xl bg-gradient-navy flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {INITIALS}
          </div>
          <div>
            <h2 className="text-navy-900">{profile.name}</h2>
            <p className="text-sm text-teal-600 font-medium">{profile.role}</p>
            <p className="text-xs text-slate-500 mt-1">{profile.location}</p>
          </div>

          <div className="w-full space-y-3 text-left pt-2 border-t border-slate-100">
            {[
              { icon: Mail,   label: profile.email   },
              { icon: Phone,  label: profile.phone   },
              { icon: MapPin, label: profile.location },
            ].map(({ icon: Icon, label }, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-slate-600">
                <Icon size={15} className="text-navy-400 shrink-0" />
                <span className="truncate">{label}</span>
              </div>
            ))}
          </div>

          <div className="w-full pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-500 mb-2">Joined on {profile.joinedOn}</p>
            <div className="flex items-center justify-center gap-2 px-3 py-2 bg-emerald-50 rounded-xl">
              <Shield size={14} className="text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700">Verified Admin Account</span>
            </div>
          </div>
        </div>

        {/* Edit & Security */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile edit */}
          <div className="section-card">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-navy-900">Personal Information</h3>
              <button onClick={() => { setEditing(v => !v); setForm({ ...profile }); }} className="btn-ghost text-xs">
                <Edit2 size={13}/> {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {editing ? (
              <form onSubmit={saveProfile} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormInput label="Full Name" id="p-name" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                  <FormInput label="Email" id="p-email" type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormInput label="Phone" id="p-phone" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                  <FormInput label="Location" id="p-loc" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setEditing(false)} className="btn-outline">Cancel</button>
                  <button type="submit" className="btn-primary">Save Changes</button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Full Name', value: profile.name   },
                  { label: 'Email',     value: profile.email  },
                  { label: 'Phone',     value: profile.phone  },
                  { label: 'Role',      value: profile.role   },
                  { label: 'Location',  value: profile.location },
                  { label: 'Joined',    value: profile.joinedOn },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="text-sm font-semibold text-navy-900 mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Password change */}
          <div className="section-card">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-navy-900">Security Settings</h3>
                <p className="text-xs text-slate-500 mt-0.5">Manage your password and account security</p>
              </div>
              <button onClick={() => setPwMode(v => !v)} className="btn-ghost text-xs">
                <Lock size={13}/> {pwMode ? 'Cancel' : 'Change Password'}
              </button>
            </div>

            {pwMode ? (
              <form onSubmit={changePassword} className="space-y-4 max-w-sm">
                <FormInput label="Current Password" id="pw-cur" type="password" required value={pwForm.current} onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))} />
                <FormInput label="New Password"     id="pw-new" type="password" required value={pwForm.next}    onChange={e => setPwForm(p => ({ ...p, next: e.target.value }))} />
                <FormInput label="Confirm Password" id="pw-con" type="password" required value={pwForm.confirm} onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))} />
                <button type="submit" className="btn-primary">Update Password</button>
              </form>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                <CheckCircle size={18} className="text-emerald-500" />
                <div>
                  <p className="text-sm font-semibold text-navy-900">Password is set</p>
                  <p className="text-xs text-slate-500 mt-0.5">Last changed on January 1, 2025</p>
                </div>
              </div>
            )}
          </div>

          {/* Access overview */}
          <div className="section-card">
            <h3 className="text-navy-900 mb-4">System Access Overview</h3>
            <div className="flex flex-wrap gap-2">
              {profile.access.map(module => (
                <span key={module} className="flex items-center gap-1.5 px-3 py-1.5 bg-navy-50 text-navy-700 text-xs font-semibold rounded-lg">
                  <CheckCircle size={11} className="text-teal-500" /> {module}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
