import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Bus, Route,
  GitBranch, Bell, UserCircle,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

const NAV_ITEMS = [
  { to: '/',              icon: LayoutDashboard, label: 'Dashboard'    },
  { to: '/drivers',       icon: Users,           label: 'Drivers'      },
  { to: '/buses',         icon: Bus,             label: 'Buses'        },
  { to: '/routes',        icon: Route,           label: 'Routes'       },
  { to: '/assignments',   icon: GitBranch,       label: 'Assignments'  },
  { to: '/notifications', icon: Bell,            label: 'Notifications'},
  { to: '/profile',       icon: UserCircle,      label: 'Admin Profile'},
];

export default function Sidebar() {
  const { state, dispatch } = useApp();
  const { adminProfile } = useAuth();
  const open = state.sidebarOpen;
  const location = useLocation();

  const toggle = () => dispatch({ type: 'TOGGLE_SIDEBAR' });

  return (
    <motion.aside
      animate={{ width: open ? 256 : 72 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="relative h-screen flex flex-col bg-navy-900 text-white shrink-0 z-30"
    >
      {/* ── Brand ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-navy-700 overflow-hidden">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
          <img src="/vahan_mitra.png" alt="Vahan Mitra" className="w-full h-full object-contain" />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <p className="text-base font-bold leading-tight">Vahan Mitra</p>
              <p className="text-xs text-teal-400 font-medium">Transport Admin</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Nav ───────────────────────────────────────────────────── */}
      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto overflow-x-hidden">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
          const isActive = to === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(to);

          return (
            <NavLink
              key={to}
              to={to}
              title={!open ? label : undefined}
              className={clsx(
                'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group',
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-navy-300 hover:bg-white/6 hover:text-white',
              )}
            >
              {/* Active indicator strip */}
              {isActive && (
                <motion.span
                  layoutId="activeNav"
                  className="absolute left-[-8px] inset-y-0 my-auto w-1.5 h-8 rounded-r-full bg-teal-400 shadow-[0_0_12px_rgba(45,212,191,0.4)]"
                />
              )}
              <Icon
                size={18}
                className={clsx(
                  'shrink-0 transition-colors',
                  isActive ? 'text-teal-400' : 'text-navy-400 group-hover:text-white',
                )}
              />
              <AnimatePresence>
                {open && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </nav>

      {/* ── Toggle Button ─────────────────────────────────────────── */}
      <button
        onClick={toggle}
        className="absolute -right-3 top-[72px] w-6 h-6 rounded-full bg-navy-700 border border-navy-600
                   flex items-center justify-center text-navy-300 hover:bg-teal-600 hover:text-white
                   transition-all duration-150 z-50 shadow-md"
        aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {open ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
      </button>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <div className={clsx(
        'border-t border-navy-700 p-4 flex items-center gap-3 overflow-hidden',
      )}>
        <div className="w-8 h-8 rounded-full bg-gradient-teal flex items-center justify-center text-white text-xs font-bold shrink-0">
          {adminProfile
            ? adminProfile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
            : '…'}
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="overflow-hidden"
            >
              <p className="text-xs font-semibold text-white leading-none">{adminProfile?.name ?? 'Loading…'}</p>
              <p className="text-xs text-navy-400 mt-0.5">{adminProfile?.role ?? ''}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}
