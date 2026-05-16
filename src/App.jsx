import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import AppLayout from './components/layout/AppLayout';

// Pages
import Login         from './pages/Login';
import SetPassword   from './pages/SetPassword';
import Dashboard     from './pages/Dashboard';
import Drivers       from './pages/Drivers';
import Buses         from './pages/Buses';
import RoutesPage    from './pages/Routes';
import RouteDetails  from './pages/RouteDetails';
import Assignments   from './pages/Assignments';
import Notifications from './pages/Notifications';
import Profile       from './pages/Profile';
import Settings      from './pages/Settings';

const ProtectedRoute = ({ children }) => {
  const { user, requiresPasswordReset } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiresPasswordReset) {
    return <Navigate to="/set-password" replace />;
  }

  // Only initialize AppProvider (and fetch data) if the user is authenticated
  return <AppProvider>{children}</AppProvider>;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public / Unprotected Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/set-password" element={<SetPassword />} />

          {/* Protected Routes (nested under AppLayout) */}
          <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route index              element={<Dashboard />}    />
            <Route path="drivers"    element={<Drivers />}      />
            <Route path="buses"      element={<Buses />}        />
            <Route path="routes"     element={<RoutesPage />}   />
            <Route path="routes/:id" element={<RouteDetails />} />
            <Route path="assignments"   element={<Assignments />}   />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile"    element={<Profile />}     />
            <Route path="settings"   element={<Settings />}    />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
