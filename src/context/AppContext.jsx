import { createContext, useContext, useReducer } from 'react';
import {
  mockDrivers, mockBuses, mockRoutes, mockAssignments,
  mockNotifications, mockActivityLogs,
} from '../data/mockData';

// ─── Initial State ────────────────────────────────────────────────────────────
const initialState = {
  drivers:       mockDrivers,
  buses:         mockBuses,
  routes:        mockRoutes,
  assignments:   mockAssignments,
  notifications: mockNotifications,
  activityLogs:  mockActivityLogs,
  sidebarOpen:   true,
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
function appReducer(state, action) {
  const addLog = (action, description) => ({
    id: `L${Date.now()}`,
    action, description,
    user: 'Admin',
    timestamp: new Date().toISOString(),
    type: action.toLowerCase().includes('add') || action.toLowerCase().includes('creat') ? 'create'
        : action.toLowerCase().includes('delete') || action.toLowerCase().includes('remov') ? 'delete'
        : action.toLowerCase().includes('notif') ? 'notify' : 'update',
  });

  switch (action.type) {
    // ── Sidebar ──────────────────────────────────────────────────────────────
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'SET_SIDEBAR':
      return { ...state, sidebarOpen: action.payload };

    // ── Drivers ──────────────────────────────────────────────────────────────
    case 'ADD_DRIVER': {
      const newDriver = { ...action.payload, id: `D${String(state.drivers.length + 1).padStart(3,'0')}`, trips: 0 };
      return {
        ...state,
        drivers: [...state.drivers, newDriver],
        activityLogs: [addLog('Driver Added', `New driver ${newDriver.name} (${newDriver.id}) added.`), ...state.activityLogs],
      };
    }
    case 'UPDATE_DRIVER': {
      return {
        ...state,
        drivers: state.drivers.map(d => d.id === action.payload.id ? { ...d, ...action.payload } : d),
        activityLogs: [addLog('Driver Updated', `Driver ${action.payload.name} (${action.payload.id}) updated.`), ...state.activityLogs],
      };
    }
    case 'DELETE_DRIVER': {
      const driver = state.drivers.find(d => d.id === action.payload);
      return {
        ...state,
        drivers: state.drivers.filter(d => d.id !== action.payload),
        activityLogs: [addLog('Driver Deleted', `Driver ${driver?.name} (${action.payload}) removed.`), ...state.activityLogs],
      };
    }

    // ── Buses ────────────────────────────────────────────────────────────────
    case 'ADD_BUS': {
      const newBus = { ...action.payload, id: `BUS-${100 + state.buses.length + 1}` };
      return {
        ...state,
        buses: [...state.buses, newBus],
        activityLogs: [addLog('Bus Added', `New bus ${newBus.id} registered.`), ...state.activityLogs],
      };
    }
    case 'UPDATE_BUS': {
      return {
        ...state,
        buses: state.buses.map(b => b.id === action.payload.id ? { ...b, ...action.payload } : b),
        activityLogs: [addLog('Bus Updated', `Bus ${action.payload.id} details updated.`), ...state.activityLogs],
      };
    }
    case 'DELETE_BUS': {
      return {
        ...state,
        buses: state.buses.filter(b => b.id !== action.payload),
        activityLogs: [addLog('Bus Deleted', `Bus ${action.payload} removed from system.`), ...state.activityLogs],
      };
    }

    // ── Routes ───────────────────────────────────────────────────────────────
    case 'ADD_ROUTE': {
      const newRoute = { ...action.payload, id: `R${String(state.routes.length + 1).padStart(3,'0')}`, totalTrips: 0, activePassengers: 0, stops: action.payload.stops || [] };
      return {
        ...state,
        routes: [...state.routes, newRoute],
        activityLogs: [addLog('Route Added', `New route ${newRoute.name} created.`), ...state.activityLogs],
      };
    }
    case 'UPDATE_ROUTE': {
      return {
        ...state,
        routes: state.routes.map(r => r.id === action.payload.id ? { ...r, ...action.payload } : r),
        activityLogs: [addLog('Route Updated', `Route ${action.payload.name} modified.`), ...state.activityLogs],
      };
    }
    case 'DELETE_ROUTE': {
      const route = state.routes.find(r => r.id === action.payload);
      return {
        ...state,
        routes: state.routes.filter(r => r.id !== action.payload),
        activityLogs: [addLog('Route Deleted', `Route ${route?.name} removed.`), ...state.activityLogs],
      };
    }

    // ── Assignments ──────────────────────────────────────────────────────────
    case 'ADD_ASSIGNMENT': {
      const newAssign = { ...action.payload, id: `A${String(state.assignments.length + 1).padStart(3,'0')}` };
      return {
        ...state,
        assignments: [...state.assignments, newAssign],
        activityLogs: [addLog('Assignment Created', `Assignment ${newAssign.id}: Driver ${newAssign.driverId} → ${newAssign.busId} → ${newAssign.routeId}.`), ...state.activityLogs],
      };
    }
    case 'DELETE_ASSIGNMENT': {
      return {
        ...state,
        assignments: state.assignments.filter(a => a.id !== action.payload),
        activityLogs: [addLog('Assignment Removed', `Assignment ${action.payload} removed.`), ...state.activityLogs],
      };
    }

    // ── Notifications ────────────────────────────────────────────────────────
    case 'SEND_NOTIFICATION': {
      const newNotif = {
        ...action.payload,
        id: `N${String(state.notifications.length + 1).padStart(3,'0')}`,
        sentAt: new Date().toISOString(),
        sentBy: 'Admin',
        status: 'Delivered',
        recipients: Math.floor(Math.random() * 800) + 100,
      };
      return {
        ...state,
        notifications: [newNotif, ...state.notifications],
        activityLogs: [addLog('Notification Sent', `"${newNotif.title}" sent to ${newNotif.target}.`), ...state.activityLogs],
      };
    }

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
