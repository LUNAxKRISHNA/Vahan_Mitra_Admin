import { useState } from 'react';
import { Mail, Phone, Shield, Edit2, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '../components/ui/PageHeader';
import { FormInput } from '../components/ui/FormInput';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabase';

export default function Profile() {
  const { adminProfile, profileLoading, user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  // Populate form when entering edit mode
  const startEditing = () => {
    setForm({
      name:   adminProfile?.name    ?? '',
      phn_no: adminProfile?.phn_no  ?? '',
    });
    setEditing(true);
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    if (!adminProfile?.id) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('admin')
        .update({ name: form.name, phn_no: form.phn_no })
        .eq('id', adminProfile.id);
      if (error) throw error;
      toast.success('Profile updated successfully');
      setEditing(false);
      // Note: AuthContext will reflect new values on next session refresh.
      // For an instant UI update, optimistic update is applied below via local state.
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // ── Loading state ─────────────────────────────────────────────────────────
  if (profileLoading) {
    return (
      <div className="page-container">
        <PageHeader title="Admin Profile" subtitle="Manage your account details" breadcrumb={['Admin Profile']} />
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-navy-400">
          <Loader2 size={32} className="animate-spin text-teal-500" />
          <p className="text-sm font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // ── Error / not found state ───────────────────────────────────────────────
  if (!adminProfile) {
    return (
      <div className="page-container">
        <PageHeader title="Admin Profile" subtitle="Manage your account details" breadcrumb={['Admin Profile']} />
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-slate-500">
          <AlertCircle size={32} className="text-amber-400" />
          <p className="text-sm font-semibold text-navy-700">No profile found for <span className="text-teal-600">{user?.email}</span></p>
          <p className="text-xs text-slate-400">Contact a system administrator to add your record to the admin table.</p>
        </div>
      </div>
    );
  }

  // Derive display data — use edited form values optimistically while saving
  const display = editing ? { ...adminProfile, ...form } : adminProfile;
  const INITIALS = (display.name || 'A')
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="page-container">
      <PageHeader title="Admin Profile" subtitle="Manage your account and security settings" breadcrumb={['Admin Profile']} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Profile Card ──────────────────────────────────────────────── */}
        <div className="section-card flex flex-col items-center text-center space-y-4">
          <div className="w-24 h-24 rounded-3xl bg-gradient-navy flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {INITIALS}
          </div>
          <div>
            <h2 className="text-navy-900">{display.name}</h2>
            <p className="text-sm text-teal-600 font-medium">{display.role}</p>
          </div>

          <div className="w-full space-y-3 text-left pt-2 border-t border-slate-100">
            {[
              { icon: Mail,  label: display.email  },
              { icon: Phone, label: display.phn_no },
            ].map(({ icon: Icon, label }, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-slate-600">
                <Icon size={15} className="text-navy-400 shrink-0" />
                <span className="truncate">{label || '—'}</span>
              </div>
            ))}
          </div>

          <div className="w-full pt-2 border-t border-slate-100">
            <div className="flex items-center justify-center gap-2 px-3 py-2 bg-emerald-50 rounded-xl">
              <Shield size={14} className="text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700">Verified Admin Account</span>
            </div>
          </div>
        </div>

        {/* ── Personal Information ──────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="section-card">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-navy-900">Personal Information</h3>
              <button
                onClick={editing ? () => setEditing(false) : startEditing}
                className="btn-ghost text-xs"
              >
                <Edit2 size={13} /> {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {editing ? (
              <form onSubmit={saveProfile} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label="Full Name"
                    id="p-name"
                    required
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  />
                  <FormInput
                    label="Phone Number"
                    id="p-phone"
                    value={form.phn_no}
                    onChange={e => setForm(p => ({ ...p, phn_no: e.target.value }))}
                  />
                </div>
                <p className="text-xs text-slate-400">
                  Email and Role are managed by system administrators and cannot be changed here.
                </p>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setEditing(false)} className="btn-outline">Cancel</button>
                  <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Full Name',     value: display.name   },
                  { label: 'Email Address', value: display.email  },
                  { label: 'Phone Number',  value: display.phn_no },
                  { label: 'Role',          value: display.role   },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="text-sm font-semibold text-navy-900 mt-0.5">{value || '—'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Google Sign-In Notice ─────────────────────────────────── */}
          <div className="section-card">
            <h3 className="text-navy-900 mb-4">Authentication</h3>
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
              <CheckCircle size={18} className="text-emerald-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-navy-900">Signed in via Google</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your account is secured through Google OAuth. Password management is handled by Google.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
