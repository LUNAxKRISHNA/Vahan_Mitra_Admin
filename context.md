# Architectural Context: Vahan Mitra Admin

## 1. System Overview
Vahan Mitra Admin is a frontend dashboard application designed for fleet and transport management. It provides administrative interfaces for tracking drivers, vehicles (buses), routes, and operational assignments.

## 2. Architectural Pattern
Currently, the application operates as a **Client-Side Single Page Application (SPA)** with a fully mocked data layer. 
It follows a localized global state management pattern using React's Context API and the `useReducer` hook, effectively functioning as an in-memory database during the session.

## 3. Tech Stack
- **Framework**: React 18 with Vite
- **Routing**: React Router DOM v6
- **State Management**: React Context API (`useReducer`)
- **Styling**: Tailwind CSS
- **UI Libraries**: 
  - TanStack Table (Data Grids)
  - Recharts (Analytics and Data Visualization)
  - Lucide React (Iconography)
  - Framer Motion (Micro-interactions and Animations)
- **Intended Backend**: Supabase (Configured but currently inactive)

## 4. Directory Structure & Modules
- `src/pages/`: Contains the main application views (e.g., Dashboard, Drivers, Buses, Routes).
- `src/components/layout/`: Core architectural wrappers (`AppLayout`, `Sidebar`, `Navbar`).
- `src/components/ui/`: Reusable, stateless UI primitives (Buttons, Modals, Forms).
- `src/context/`: Contains `AppContext.jsx`, the central nervous system for application state.
- `src/data/`: Contains `mockData.js`, the current source of truth for all seed data.
- `src/utils/`: Contains `supabase.js`, the initialized but currently unused Supabase client.

## 5. Data Flow & State Management

### 5.1. Data Source (The "Mock Database")
**Crucial Architectural Note**: The application currently **DOES NOT fetch data from Supabase** or any external REST/GraphQL API. 
All data originates synchronously from `src/data/mockData.js`. This file exports hardcoded arrays of objects (e.g., `mockDrivers`, `mockBuses`, `mockRoutes`, `mockAssignments`).

### 5.2. State Initialization
In `src/context/AppContext.jsx`, the `initialState` object is seeded directly with the mock arrays imported from `mockData.js`. 

### 5.3. State Mutation (Reducers)
The `AppContext` utilizes a centralized `appReducer`.
- UI components dispatch synchronous actions (e.g., `ADD_DRIVER`, `UPDATE_BUS`, `DELETE_ROUTE`).
- The reducer pure function processes these actions, creating and returning a new state object (e.g., appending a new driver to the in-memory array or filtering out a deleted bus).
- **Automated Side Effects**: The reducer intercepts modifying actions (Create, Update, Delete) and automatically generates and prepends a new audit log entry into the `activityLogs` state array.

### 5.4. Component Consumption
Pages and underlying components consume the global state and dispatch function via the custom hook `useApp()`. There is no prop-drilling required for core entities.

## 6. Pending Backend Integration (Supabase)
The infrastructure for a Supabase backend is partially present but unconnected.
- `src/utils/supabase.js` is configured to initialize a client using `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` environment variables.
- **Migration Path**: To transition to production, the architecture must shift from the synchronous `useReducer` pattern to an asynchronous model. The mock arrays in `initialState` must be replaced with `useEffect` data fetching logic (or a library like React Query/SWR), and reducer actions must be replaced or supplemented with async calls to the Supabase client.
