import { createContext, useContext, useReducer, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { busAPI, driverAPI, routeAPI, assignmentAPI } from '../services/api';

// ─── Initial State ────────────────────────────────────────────────────────────
const initialState = {
  buses: [],
  drivers: [],
  routes: [],
  assignments: [],
  notifications: [], // Keeping mock for now as requested
  sidebarOpen: true,
  loading: {
    initial: true,
    buses: false,
    drivers: false,
    routes: false,
    assignments: false,
  },
  error: null,
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
function appReducer(state, action) {


  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: { ...state.loading, ...action.payload } };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'SET_SIDEBAR':
      return { ...state, sidebarOpen: action.payload };

    // ── Global Data Setters (Initial Load & Realtime Sync) ─────────────────
    case 'SET_BUSES':
      return { ...state, buses: action.payload };
    case 'SET_DRIVERS':
      return { ...state, drivers: action.payload };
    case 'SET_ROUTES':
      return { ...state, routes: action.payload };
    case 'SET_ASSIGNMENTS':
      return { ...state, assignments: action.payload };

    // ── Optimistic Updates (Buses) ──────────────────────────────────────────
    case 'ADD_BUS_OPTIMISTIC':
      return {
        ...state,
        buses: [...state.buses, action.payload],
      };
    case 'UPDATE_BUS_OPTIMISTIC':
      return {
        ...state,
        buses: state.buses.map(b => b.id === action.payload.id ? { ...b, ...action.payload } : b),
      };
    case 'DELETE_BUS_OPTIMISTIC':
      return {
        ...state,
        buses: state.buses.filter(b => b.id !== action.payload),
      };

    // ── Optimistic Updates (Drivers) ────────────────────────────────────────
    case 'ADD_DRIVER_OPTIMISTIC':
      return {
        ...state,
        drivers: [...state.drivers, action.payload],
      };
    case 'UPDATE_DRIVER_OPTIMISTIC':
      return {
        ...state,
        drivers: state.drivers.map(d => d.id === action.payload.id ? { ...d, ...action.payload } : d),
      };
    case 'DELETE_DRIVER_OPTIMISTIC':
      return {
        ...state,
        drivers: state.drivers.filter(d => d.id !== action.payload),
      };

    // Add similar optimistic actions for Routes and Assignments as needed...

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initial Data Fetch
  useEffect(() => {
    async function loadInitialData() {
      try {
        dispatch({ type: 'SET_LOADING', payload: { initial: true } });
        
        const [buses, drivers, routes, assignments] = await Promise.all([
          busAPI.getAll(),
          driverAPI.getAll(),
          routeAPI.getAllWithStops(),
          assignmentAPI.getAll()
        ]);

        console.log("Supabase Data Loaded:", { buses, drivers, routes, assignments });

        dispatch({ type: 'SET_BUSES', payload: buses || [] });
        dispatch({ type: 'SET_DRIVERS', payload: drivers || [] });
        dispatch({ type: 'SET_ROUTES', payload: routes || [] });
        dispatch({ type: 'SET_ASSIGNMENTS', payload: assignments || [] });
        
      } catch (err) {
        console.error("Failed to load initial data", err);
        dispatch({ type: 'SET_ERROR', payload: err.message });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: { initial: false } });
      }
    }

    loadInitialData();

    // Set up Realtime Subscriptions
    const busesSubscription = supabase.channel('public:buses')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'buses' }, async () => {
        // Simple approach: re-fetch on any change to ensure consistency
        const newBuses = await busAPI.getAll();
        dispatch({ type: 'SET_BUSES', payload: newBuses });
      }).subscribe();

    const driversSubscription = supabase.channel('public:drivers')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'drivers' }, async () => {
        const newDrivers = await driverAPI.getAll();
        dispatch({ type: 'SET_DRIVERS', payload: newDrivers });
      }).subscribe();
      
    const routesSubscription = supabase.channel('public:routes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'routes' }, async () => {
        const newRoutes = await routeAPI.getAllWithStops();
        dispatch({ type: 'SET_ROUTES', payload: newRoutes });
      }).subscribe();

    const assignmentsSubscription = supabase.channel('public:assignments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'assignments' }, async () => {
        const newAssignments = await assignmentAPI.getAll();
        dispatch({ type: 'SET_ASSIGNMENTS', payload: newAssignments });
      }).subscribe();

    const stopsSubscription = supabase.channel('public:route_stops')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'route_stops' }, async () => {
        // When any stop changes, re-fetch all routes to update the joined data
        const newRoutes = await routeAPI.getAllWithStops();
        dispatch({ type: 'SET_ROUTES', payload: newRoutes });
      }).subscribe();

    return () => {
      supabase.removeChannel(busesSubscription);
      supabase.removeChannel(driversSubscription);
      supabase.removeChannel(routesSubscription);
      supabase.removeChannel(assignmentsSubscription);
      supabase.removeChannel(stopsSubscription);
    };
  }, []);

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
