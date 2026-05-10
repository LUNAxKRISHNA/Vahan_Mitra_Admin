// ─── Mock Data for Vahan Mitra Admin Dashboard ──────────────────────────────
// All data is static JSON. Replace with API calls for backend integration.

// ─── DRIVERS ────────────────────────────────────────────────────────────────
export const mockDrivers = [
  { id: 'D001', name: 'Ramesh Kumar', phone: '9876543210', license: 'KA01-20190012', address: '12, MG Road, Bengaluru', assignedBus: 'BUS-101', status: 'Active', joinDate: '2021-03-15', trips: 342 },
  { id: 'D002', name: 'Suresh Nair', phone: '9845671234', license: 'KL05-20180034', address: '34, Nehru Nagar, Kochi', assignedBus: 'BUS-102', status: 'Active', joinDate: '2020-07-01', trips: 521 },
];

// ─── BUSES ──────────────────────────────────────────────────────────────────
export const mockBuses = [
  { id: 'BUS-101', regNumber: 'KA01-F-1234', capacity: 52, routeId: 'R001', driverId: 'D001', status: 'Active', year: 2020, fuel: 'Diesel', lastService: '2024-11-10' },
  { id: 'BUS-102', regNumber: 'KA02-G-5678', capacity: 44, routeId: 'R002', driverId: 'D002', status: 'Active', year: 2019, fuel: 'Diesel', lastService: '2024-10-22' },
  { id: 'BUS-103', regNumber: 'KA03-H-9012', capacity: 48, routeId: 'R003', driverId: 'D003', status: 'Maintenance', year: 2018, fuel: 'CNG', lastService: '2024-12-01' },
];

// ─── ROUTES ─────────────────────────────────────────────────────────────────
export const mockRoutes = [
  {
    id: 'R001', name: 'Majestic – Whitefield Express',
    startPoint: 'Kempegowda Bus Terminal, Majestic',
    endPoint: 'Whitefield Main Road',
    distance: '28 km', estimatedTime: '65 min',
    totalTrips: 12, activePassengers: 1240,
    stops: [
      { name: 'Kempegowda Bus Terminal', time: '06:00', type: 'start' },
      { name: 'Shivajinagar', time: '06:12', type: 'stop' },
      { name: 'Domlur', time: '06:28', type: 'stop' },
      { name: 'Marathahalli Bridge', time: '06:48', type: 'stop' },
      { name: 'ITPL Main Gate', time: '07:01', type: 'stop' },
      { name: 'Whitefield Main Road', time: '07:05', type: 'end' },
    ],
  },
  {
    id: 'R002', name: 'Electronic City – Hebbal',
    startPoint: 'Electronic City Phase 1',
    endPoint: 'Hebbal Flyover',
    distance: '35 km', estimatedTime: '80 min',
    totalTrips: 10, activePassengers: 980,
    stops: [
      { name: 'Electronic City Phase 1', time: '06:00', type: 'start' },
      { name: 'Silk Board Junction', time: '06:20', type: 'stop' },
      { name: 'Koramangala', time: '06:38', type: 'stop' },
      { name: 'Indiranagar', time: '06:52', type: 'stop' },
      { name: 'Bellary Road', time: '07:10', type: 'stop' },
      { name: 'Hebbal Flyover', time: '07:20', type: 'end' },
    ],
  },
];

// ─── ASSIGNMENTS ─────────────────────────────────────────────────────────────
export const mockAssignments = [
  { id: 'A001', driverId: 'D001', busId: 'BUS-101', routeId: 'R001', shift: 'Morning', startTime: '06:00', endTime: '10:00', status: 'Active', date: '2025-05-10' },
  { id: 'A002', driverId: 'D002', busId: 'BUS-102', routeId: 'R002', shift: 'Morning', startTime: '06:00', endTime: '10:00', status: 'Active', date: '2025-05-10' },
  { id: 'A003', driverId: 'D004', busId: 'BUS-104', routeId: 'R001', shift: 'Evening', startTime: '16:00', endTime: '20:00', status: 'Scheduled', date: '2025-05-10' },
];

// ─── NOTIFICATIONS ───────────────────────────────────────────────────────────
export const mockNotifications = [
  { id: 'N001', title: 'Route Diversion Alert', message: 'Route R001 diverted via Domlur due to road work near Indiranagar.', target: 'Route R001', type: 'Alert', status: 'Delivered', sentAt: '2025-05-10T08:30:00', sentBy: 'Admin', recipients: 340 },
];

// ─── ACTIVITY LOGS ───────────────────────────────────────────────────────────
export const mockActivityLogs = [
];

// ─── DASHBOARD STATS ─────────────────────────────────────────────────────────
export const mockDashboardStats = {
  totalBuses: mockBuses.length,
  activeBuses: mockBuses.filter(b => b.status === 'Active').length,
  totalDrivers: mockDrivers.length,
  assignedRoutes: mockRoutes.length,
  tripsToday: 68,
  notifications: mockNotifications.length,
};

// ─── TRIP CHART DATA (last 7 days) ───────────────────────────────────────────
export const mockTripData = [
  { day: 'Mon', trips: 58, passengers: 2100 },
  { day: 'Tue', trips: 63, passengers: 2340 },
  { day: 'Wed', trips: 70, passengers: 2580 },
  { day: 'Thu', trips: 65, passengers: 2430 },
  { day: 'Fri', trips: 72, passengers: 2710 },
  { day: 'Sat', trips: 45, passengers: 1620 },
  { day: 'Sun', trips: 38, passengers: 1310 },
];

// ─── BUS STATUS DONUT ────────────────────────────────────────────────────────
export const mockBusStatusData = [
  { name: 'Active', value: mockBuses.filter(b => b.status === 'Active').length, color: '#0D9488' },
  { name: 'Idle', value: mockBuses.filter(b => b.status === 'Idle').length, color: '#0F2044' },
  { name: 'Maintenance', value: mockBuses.filter(b => b.status === 'Maintenance').length, color: '#F59E0B' },
  { name: 'Inactive', value: mockBuses.filter(b => b.status === 'Inactive').length, color: '#F43F5E' },
];

// ─── ROUTE TRAFFIC ───────────────────────────────────────────────────────────
export const mockRouteTrafficData = mockRoutes.map(r => ({
  route: r.name.split('–')[0].trim(),
  trips: r.totalTrips,
  passengers: r.activePassengers,
}));

// ─── ADMIN PROFILE ───────────────────────────────────────────────────────────
export const mockAdminProfile = {
  name: 'Vahan Mitra Admin',
  email: 'admin@vahanmitra.in',
  phone: '9988770099',
  role: 'Super Admin',
  location: 'CVV Head Office',
  joinedOn: '2023-01-01',
  avatar: null,
  access: ['Dashboard', 'Drivers', 'Buses', 'Routes', 'Assignments', 'Notifications', 'Activity Logs', 'Settings'],
};
