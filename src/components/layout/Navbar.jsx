import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, UserCircle, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/auth';
import clsx from 'clsx';

// ─── Breadcrumb map ───────────────────────────────────────────────────────────
const BREADCRUMBS = {
  '/':              ['Dashboard'],
  '/drivers':       ['Drivers'],
  '/buses':         ['Buses'],
  '/routes':        ['Routes'],
  '/routes/':       ['Routes', 'Route Details'],
  '/assignments':   ['Assignments'],
  '/notifications': ['Notifications'],
  '/profile':       ['Admin Profile'],
};

export default function Navbar() {
  const { state } = useApp();
  const { adminProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef(null);
  const notifRef   = useRef(null);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current   && !notifRef.current.contains(e.target))   setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Build breadcrumb
  const path = location.pathname;
  const crumbs = BREADCRUMBS[path] || BREADCRUMBS[path.replace(/\/[^/]+$/, '/')] || ['Page'];
  const unreadNotifs = state.notifications.filter(n => n.status === 'Pending').length;

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center px-6 gap-4 sticky top-0 z-20 shadow-sm">
      {/* ── Breadcrumb ─────────────────────────────────────────────── */}
      <nav className="flex items-center gap-1.5 text-sm text-navy-500 font-medium shrink-0">
        <span className="text-navy-900 font-semibold">{crumbs[crumbs.length - 1]}</span>
        {crumbs.length > 1 && (
          <>
            <span className="text-slate-300">/</span>
            {crumbs.slice(0, -1).map((c, i) => (
              <span key={i} className="text-navy-400">{c}</span>
            ))}
          </>
        )}
      </nav>

      {/* ── Spacer ─────────────────────────────────────────────────── */}
      <div className="flex-1" />

      {/* ── Notification Bell ──────────────────────────────────────── */}
      <div className="relative" ref={notifRef}>
        <button
          onClick={() => { setNotifOpen(v => !v); setProfileOpen(false); }}
          className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-navy-600 transition-colors"
          aria-label="Notifications"
        >
          <Bell size={18} />
          {unreadNotifs > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
              {unreadNotifs}
            </span>
          )}
        </button>

        {notifOpen && (
          <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-glass-lg border border-slate-100 overflow-hidden z-50">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <span className="text-sm font-semibold text-navy-900">Notifications</span>
              <button onClick={() => { navigate('/notifications'); setNotifOpen(false); }} className="text-xs text-teal-600 font-medium hover:underline">
                View all
              </button>
            </div>
            <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
              {state.notifications.slice(0, 5).map(n => (
                <div key={n.id} className="px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className={clsx(
                      'w-2 h-2 rounded-full mt-1.5 shrink-0',
                      n.type === 'Emergency' ? 'bg-red-500' : n.type === 'Alert' ? 'bg-amber-500' : 'bg-teal-500',
                    )} />
                    <div>
                      <p className="text-xs font-semibold text-navy-900">{n.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Profile Dropdown ───────────────────────────────────────── */}
      <div className="relative" ref={profileRef}>
        <button
          onClick={() => { setProfileOpen(v => !v); setNotifOpen(false); }}
          className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-navy flex items-center justify-center text-white text-xs font-bold">
            {adminProfile
              ? adminProfile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
              : '…'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-navy-900 leading-none">{adminProfile?.name ?? 'Loading…'}</p>
            <p className="text-xs text-slate-500 mt-0.5">{adminProfile?.role ?? ''}</p>
          </div>
          <ChevronDown size={14} className={clsx('text-slate-400 transition-transform', profileOpen && 'rotate-180')} />
        </button>

        {profileOpen && (
          <div className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-glass-lg border border-slate-100 overflow-hidden z-50">
            <button
              onClick={() => { navigate('/profile'); setProfileOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-navy-700 hover:bg-slate-50 transition-colors"
            >
              <UserCircle size={16} /> My Profile
            </button>
            <hr className="border-slate-100" />
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
