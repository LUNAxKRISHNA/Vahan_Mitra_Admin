import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import AppLayout from './components/layout/AppLayout';

// Pages
import Dashboard     from './pages/Dashboard';
import Drivers       from './pages/Drivers';
import Buses         from './pages/Buses';
import RoutesPage    from './pages/Routes';
import RouteDetails  from './pages/RouteDetails';
import Assignments   from './pages/Assignments';
import Notifications from './pages/Notifications';
import ActivityLogs  from './pages/ActivityLogs';
import Profile       from './pages/Profile';
import Settings      from './pages/Settings';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* All routes are nested under the AppLayout (sidebar + navbar) */}
          <Route path="/" element={<AppLayout />}>
            <Route index              element={<Dashboard />}    />
            <Route path="drivers"    element={<Drivers />}      />
            <Route path="buses"      element={<Buses />}        />
            <Route path="routes"     element={<RoutesPage />}   />
            <Route path="routes/:id" element={<RouteDetails />} />
            <Route path="assignments"   element={<Assignments />}   />
            <Route path="notifications" element={<Notifications />} />
            <Route path="activity-logs" element={<ActivityLogs />}  />
            <Route path="profile"    element={<Profile />}     />
            <Route path="settings"   element={<Settings />}    />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

