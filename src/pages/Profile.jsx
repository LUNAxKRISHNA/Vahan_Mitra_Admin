import { useState, useEffect } from 'react';
import { UserCircle, Mail, Phone, MapPin, Shield, Edit2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabase';
import PageHeader from '../components/ui/PageHeader';
import { FormInput } from '../components/ui/FormInput';

const GoogleIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function Profile() {
  const { adminData, refreshAdminData, session } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form,    setForm]    = useState(null);
  
  const isGoogleUser = session?.user?.app_metadata?.provider === 'google';

  useEffect(() => {
    if (adminData) {
      setProfile(adminData);
      setForm({ ...adminData });
    }
  }, [adminData]);

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      setEditing(false); // Optimistic UI state reset
      
      const { error } = await supabase
        .from('admin')
        .update({
          name: form.name,
          email: form.email,
          phn_no: form.phone,
        })
        .eq('id', profile.id);

      if (error) throw error;

      await refreshAdminData();
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
      setForm({ ...profile }); // Reset on failure
    }
  };

  if (!profile) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-navy-500">Loading admin profile...</p>
        </div>
      </div>
    );
  }

  const INITIALS = profile.name.split(' ').map(n => n[0]).join('').toUpperCase();

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

          {/* Security details */}
          <div className="section-card">
            <div className="mb-5">
              <h3 className="text-navy-900">Security Settings</h3>
              <p className="text-xs text-slate-500 mt-0.5">Manage your password and account security</p>
            </div>

            {isGoogleUser ? (
              <div className="flex items-center gap-3.5 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm shrink-0">
                  <GoogleIcon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy-900">Signed in with Google</p>
                  <p className="text-xs text-slate-500 mt-0.5">Your credentials and security settings are managed securely by Google.</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <CheckCircle size={18} className="text-emerald-500" />
                <div>
                  <p className="text-sm font-semibold text-navy-900">Password is set</p>
                  <p className="text-xs text-slate-500 mt-0.5">Secured by Supabase Authentication</p>
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
