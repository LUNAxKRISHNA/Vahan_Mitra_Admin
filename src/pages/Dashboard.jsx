import { Bus, Users, Route, GitBranch, Zap, Bell, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import StatCard from '../components/ui/StatCard';
import ActivityTimeline from '../components/ui/ActivityTimeline';
import NotificationCard from '../components/ui/NotificationCard';
import TripChart from '../components/charts/TripChart';
import BusStatusChart from '../components/charts/BusStatusChart';
import RouteTrafficChart from '../components/charts/RouteTrafficChart';
import { mockDashboardStats } from '../data/mockData';

const QUICK_ACTIONS = [
  { label: 'Add Driver',      path: '/drivers',       color: 'btn-primary'  },
  { label: 'Add Bus',         path: '/buses',         color: 'btn-secondary'},
  { label: 'Add Route',       path: '/routes',        color: 'btn-outline'  },
  { label: 'Send Alert',      path: '/notifications', color: 'btn-outline'  },
];

export default function Dashboard() {
  const { state } = useApp();
  const navigate   = useNavigate();

  const stats = [
    { title: 'Total Buses',     value: mockDashboardStats.totalBuses,    icon: Bus,        accent: 'stat-navy',   trend: 5,  subtitle: `${mockDashboardStats.activeBuses} currently active`, delay: 0 },
    { title: 'Active Buses',    value: mockDashboardStats.activeBuses,   icon: Zap,        accent: 'stat-teal',   trend: 8,  subtitle: 'On road right now',                                  delay: 0.05 },
    { title: 'Total Drivers',   value: mockDashboardStats.totalDrivers,  icon: Users,      accent: 'stat-indigo', trend: 2,  subtitle: `${state.drivers.filter(d => d.status === 'Active').length} active today`, delay: 0.1 },
    { title: 'Routes',          value: mockDashboardStats.assignedRoutes,icon: Route,      accent: 'stat-cyan',   trend: 0,  subtitle: 'Operational routes',                                 delay: 0.15 },
    { title: 'Trips Today',     value: mockDashboardStats.tripsToday,    icon: GitBranch,  accent: 'stat-amber',  trend: 12, subtitle: 'Completed + ongoing',                                delay: 0.2 },
    { title: 'Notifications',   value: mockDashboardStats.notifications, icon: Bell,       accent: 'stat-rose',   trend: -3, subtitle: 'Sent this week',                                     delay: 0.25 },
  ];

  return (
    <div className="page-container">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-navy-900">Good morning, Kiran! 👋</h1>
          <p className="text-sm text-slate-500 mt-1">Here's what's happening with your fleet today.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {QUICK_ACTIONS.map(a => (
            <button key={a.label} onClick={() => navigate(a.path)} className={a.color}>
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Stats Grid ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map(s => <StatCard key={s.title} {...s} />)}
      </div>

      {/* ── Charts Row ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trip Area Chart */}
        <div className="section-card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-navy-900">Weekly Trip Overview</h3>
              <p className="text-xs text-slate-500 mt-0.5">Trips & passengers for the past 7 days</p>
            </div>
          </div>
          <TripChart />
        </div>

        {/* Bus Status Donut */}
        <div className="section-card">
          <div className="mb-4">
            <h3 className="text-navy-900">Bus Fleet Status</h3>
            <p className="text-xs text-slate-500 mt-0.5">Current operational breakdown</p>
          </div>
          <BusStatusChart />
        </div>
      </div>

      {/* ── Route Traffic ──────────────────────────────────────────── */}
      <div className="section-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-navy-900">Route Traffic Analysis</h3>
            <p className="text-xs text-slate-500 mt-0.5">Trips and passenger load per route</p>
          </div>
          <button onClick={() => navigate('/routes')} className="btn-ghost text-xs">
            View Routes <ArrowRight size={13} />
          </button>
        </div>
        <RouteTrafficChart />
      </div>

      {/* ── Bottom Row ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Feed */}
        <div className="section-card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-navy-900">Recent Activity</h3>
            <button onClick={() => navigate('/activity-logs')} className="btn-ghost text-xs">
              View All <ArrowRight size={13} />
            </button>
          </div>
          <ActivityTimeline logs={state.activityLogs} limit={5} />
        </div>

        {/* Recent Notifications */}
        <div className="section-card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-navy-900">Recent Notifications</h3>
            <button onClick={() => navigate('/notifications')} className="btn-ghost text-xs">
              View All <ArrowRight size={13} />
            </button>
          </div>
          <div className="space-y-3">
            {state.notifications.slice(0, 4).map(n => (
              <NotificationCard key={n.id} notif={n} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
