// ─── Mock Data for Vahan Mitra Admin Dashboard ──────────────────────────────
// All data is static JSON. Replace with API calls for backend integration.

// ─── DRIVERS ────────────────────────────────────────────────────────────────
export const mockDrivers = [
  { id: 'D001', name: 'Ramesh Kumar',    phone: '9876543210', license: 'KA01-20190012', address: '12, MG Road, Bengaluru',   assignedBus: 'BUS-101', status: 'Active',      joinDate: '2021-03-15', trips: 342 },
  { id: 'D002', name: 'Suresh Nair',     phone: '9845671234', license: 'KL05-20180034', address: '34, Nehru Nagar, Kochi',    assignedBus: 'BUS-102', status: 'Active',      joinDate: '2020-07-01', trips: 521 },
  { id: 'D003', name: 'Anjali Sharma',   phone: '9712345678', license: 'DL01-20210056', address: '7, Patel Marg, Delhi',      assignedBus: 'BUS-103', status: 'On Leave',    joinDate: '2022-01-20', trips: 189 },
  { id: 'D004', name: 'Vikram Singh',    phone: '9900112233', license: 'MH01-20170089', address: '22, Bandra West, Mumbai',   assignedBus: 'BUS-104', status: 'Active',      joinDate: '2019-11-10', trips: 610 },
  { id: 'D005', name: 'Priya Menon',     phone: '9833445566', license: 'TN09-20200078', address: '5, Anna Salai, Chennai',    assignedBus: null,      status: 'Inactive',    joinDate: '2023-02-14', trips: 45  },
  { id: 'D006', name: 'Mohammed Idris',  phone: '9765432109', license: 'KA02-20160023', address: '88, Brigade Rd, Bengaluru', assignedBus: 'BUS-105', status: 'Active',      joinDate: '2018-05-22', trips: 890 },
  { id: 'D007', name: 'Deepika Patel',   phone: '9654321098', license: 'GJ01-20190067', address: '14, Ashram Rd, Ahmedabad',  assignedBus: 'BUS-106', status: 'Active',      joinDate: '2021-09-01', trips: 277 },
  { id: 'D008', name: 'Arun Krishnan',   phone: '9543210987', license: 'KL08-20220011', address: '3, Palayam, Thiruvananthapuram', assignedBus: null,  status: 'Training',    joinDate: '2024-01-08', trips: 12  },
  { id: 'D009', name: 'Sunita Rawat',    phone: '9432109876', license: 'UK01-20180055', address: '9, Rajpur Rd, Dehradun',    assignedBus: 'BUS-107', status: 'Active',      joinDate: '2020-04-17', trips: 433 },
  { id: 'D010', name: 'Ravi Shankar',    phone: '9321098765', license: 'AP05-20150099', address: '21, Banjara Hills, Hyderabad', assignedBus: 'BUS-108', status: 'Active',   joinDate: '2017-08-30', trips: 1102},
  { id: 'D011', name: 'Fatima Begum',    phone: '9210987654', license: 'TN01-20210033', address: '16, T. Nagar, Chennai',     assignedBus: 'BUS-109', status: 'Active',      joinDate: '2022-06-11', trips: 198 },
  { id: 'D012', name: 'Harpreet Kaur',   phone: '9109876543', license: 'PB01-20190045', address: '55, Model Town, Ludhiana',  assignedBus: null,      status: 'On Leave',    joinDate: '2021-12-03', trips: 310 },
];

// ─── BUSES ──────────────────────────────────────────────────────────────────
export const mockBuses = [
  { id: 'BUS-101', regNumber: 'KA01-F-1234', capacity: 52, routeId: 'R001', driverId: 'D001', status: 'Active',      year: 2020, fuel: 'Diesel',   lastService: '2024-11-10' },
  { id: 'BUS-102', regNumber: 'KA02-G-5678', capacity: 44, routeId: 'R002', driverId: 'D002', status: 'Active',      year: 2019, fuel: 'Diesel',   lastService: '2024-10-22' },
  { id: 'BUS-103', regNumber: 'KA03-H-9012', capacity: 48, routeId: 'R003', driverId: 'D003', status: 'Maintenance', year: 2018, fuel: 'CNG',      lastService: '2024-12-01' },
  { id: 'BUS-104', regNumber: 'KA04-J-3456', capacity: 52, routeId: 'R001', driverId: 'D004', status: 'Active',      year: 2021, fuel: 'Diesel',   lastService: '2024-09-15' },
  { id: 'BUS-105', regNumber: 'KA05-K-7890', capacity: 36, routeId: 'R004', driverId: 'D006', status: 'Active',      year: 2022, fuel: 'Electric', lastService: '2025-01-05' },
  { id: 'BUS-106', regNumber: 'KA06-L-2345', capacity: 44, routeId: 'R005', driverId: 'D007', status: 'Active',      year: 2020, fuel: 'Diesel',   lastService: '2024-11-30' },
  { id: 'BUS-107', regNumber: 'KA07-M-6789', capacity: 52, routeId: 'R002', driverId: 'D009', status: 'Idle',        year: 2017, fuel: 'Diesel',   lastService: '2024-08-20' },
  { id: 'BUS-108', regNumber: 'KA08-N-0123', capacity: 48, routeId: 'R006', driverId: 'D010', status: 'Active',      year: 2023, fuel: 'CNG',      lastService: '2025-02-10' },
  { id: 'BUS-109', regNumber: 'KA09-P-4567', capacity: 44, routeId: 'R007', driverId: 'D011', status: 'Active',      year: 2021, fuel: 'Diesel',   lastService: '2024-12-15' },
  { id: 'BUS-110', regNumber: 'KA10-Q-8901', capacity: 36, routeId: null,   driverId: null,   status: 'Inactive',    year: 2015, fuel: 'Diesel',   lastService: '2024-06-01' },
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
  {
    id: 'R003', name: 'Banashankari – Yelahanka',
    startPoint: 'Banashankari Bus Stand',
    endPoint: 'Yelahanka New Town',
    distance: '22 km', estimatedTime: '55 min',
    totalTrips: 14, activePassengers: 760,
    stops: [
      { name: 'Banashankari Bus Stand', time: '06:30', type: 'start' },
      { name: 'Jayanagar 4th Block', time: '06:40', type: 'stop' },
      { name: 'Shivaji Nagar', time: '06:52', type: 'stop' },
      { name: 'MS Ramaiah', time: '07:05', type: 'stop' },
      { name: 'Yelahanka New Town', time: '07:25', type: 'end' },
    ],
  },
  {
    id: 'R004', name: 'Kengeri – KR Puram',
    startPoint: 'Kengeri Satellite Town',
    endPoint: 'KR Puram Railway Station',
    distance: '30 km', estimatedTime: '70 min',
    totalTrips: 8, activePassengers: 540,
    stops: [
      { name: 'Kengeri Satellite Town', time: '07:00', type: 'start' },
      { name: 'Vijayanagar', time: '07:15', type: 'stop' },
      { name: 'Rajajinagar', time: '07:28', type: 'stop' },
      { name: 'Yeshwanthpur', time: '07:42', type: 'stop' },
      { name: 'KR Puram Railway Station', time: '08:10', type: 'end' },
    ],
  },
  {
    id: 'R005', name: 'HSR Layout – Peenya',
    startPoint: 'HSR Layout Sector 7',
    endPoint: 'Peenya Industrial Area',
    distance: '25 km', estimatedTime: '60 min',
    totalTrips: 10, activePassengers: 690,
    stops: [
      { name: 'HSR Layout Sector 7', time: '06:45', type: 'start' },
      { name: 'BTM Layout', time: '06:55', type: 'stop' },
      { name: 'Jayanagar', time: '07:08', type: 'stop' },
      { name: 'Yeshwanthpur Circle', time: '07:28', type: 'stop' },
      { name: 'Peenya Industrial Area', time: '07:45', type: 'end' },
    ],
  },
  {
    id: 'R006', name: 'JP Nagar – Airport Road',
    startPoint: 'JP Nagar 7th Phase',
    endPoint: 'Kempegowda International Airport',
    distance: '42 km', estimatedTime: '90 min',
    totalTrips: 6, activePassengers: 320,
    stops: [
      { name: 'JP Nagar 7th Phase', time: '05:30', type: 'start' },
      { name: 'Banashankari', time: '05:45', type: 'stop' },
      { name: 'Hebbal', time: '06:15', type: 'stop' },
      { name: 'Bellary Road Junction', time: '06:30', type: 'stop' },
      { name: 'Kempegowda International Airport', time: '07:00', type: 'end' },
    ],
  },
  {
    id: 'R007', name: 'Rajajinagar – Sarjapur',
    startPoint: 'Rajajinagar 1st Block',
    endPoint: 'Sarjapur Road Junction',
    distance: '32 km', estimatedTime: '75 min',
    totalTrips: 8, activePassengers: 480,
    stops: [
      { name: 'Rajajinagar 1st Block', time: '07:15', type: 'start' },
      { name: 'Malleshwaram', time: '07:28', type: 'stop' },
      { name: 'Shivajinagar', time: '07:42', type: 'stop' },
      { name: 'Koramangala', time: '08:05', type: 'stop' },
      { name: 'Sarjapur Road Junction', time: '08:30', type: 'end' },
    ],
  },
];

// ─── ASSIGNMENTS ─────────────────────────────────────────────────────────────
export const mockAssignments = [
  { id: 'A001', driverId: 'D001', busId: 'BUS-101', routeId: 'R001', shift: 'Morning', startTime: '06:00', endTime: '10:00', status: 'Active',   date: '2025-05-10' },
  { id: 'A002', driverId: 'D002', busId: 'BUS-102', routeId: 'R002', shift: 'Morning', startTime: '06:00', endTime: '10:00', status: 'Active',   date: '2025-05-10' },
  { id: 'A003', driverId: 'D004', busId: 'BUS-104', routeId: 'R001', shift: 'Evening', startTime: '16:00', endTime: '20:00', status: 'Scheduled',date: '2025-05-10' },
  { id: 'A004', driverId: 'D006', busId: 'BUS-105', routeId: 'R004', shift: 'Morning', startTime: '07:00', endTime: '11:00', status: 'Active',   date: '2025-05-10' },
  { id: 'A005', driverId: 'D007', busId: 'BUS-106', routeId: 'R005', shift: 'Morning', startTime: '06:45', endTime: '10:45', status: 'Active',   date: '2025-05-10' },
  { id: 'A006', driverId: 'D009', busId: 'BUS-107', routeId: 'R002', shift: 'Evening', startTime: '17:00', endTime: '21:00', status: 'Scheduled',date: '2025-05-10' },
  { id: 'A007', driverId: 'D010', busId: 'BUS-108', routeId: 'R006', shift: 'Morning', startTime: '05:30', endTime: '09:30', status: 'Completed', date: '2025-05-10' },
  { id: 'A008', driverId: 'D011', busId: 'BUS-109', routeId: 'R007', shift: 'Morning', startTime: '07:15', endTime: '11:15', status: 'Active',   date: '2025-05-10' },
];

// ─── NOTIFICATIONS ───────────────────────────────────────────────────────────
export const mockNotifications = [
  { id: 'N001', title: 'Route Diversion Alert',  message: 'Route R001 diverted via Domlur due to road work near Indiranagar.', target: 'Route R001', type: 'Alert',     status: 'Delivered', sentAt: '2025-05-10T08:30:00', sentBy: 'Admin', recipients: 340 },
  { id: 'N002', title: 'Bus Breakdown Notice',   message: 'BUS-103 is under maintenance. Passengers on Route R003 please use alternate routes.', target: 'All Users', type: 'Emergency', status: 'Delivered', sentAt: '2025-05-10T07:15:00', sentBy: 'Admin', recipients: 1240 },
  { id: 'N003', title: 'New Schedule Update',    message: 'Updated schedules for Route R006 effective May 12. Check the app for details.', target: 'Route R006', type: 'Info',      status: 'Delivered', sentAt: '2025-05-09T18:00:00', sentBy: 'Admin', recipients: 180 },
  { id: 'N004', title: 'Driver Change Notice',   message: 'Driver change on Bus BUS-102 for morning shift. New driver Ravi Shankar assigned.', target: 'Bus BUS-102',type: 'Info',      status: 'Delivered', sentAt: '2025-05-09T06:00:00', sentBy: 'Admin', recipients: 210 },
  { id: 'N005', title: 'Emergency: Road Block',  message: 'Silk Board junction blocked due to accident. All buses on Route R002 diverted via Richmond Road.', target: 'All Users', type: 'Emergency', status: 'Delivered', sentAt: '2025-05-08T09:45:00', sentBy: 'Admin', recipients: 1240 },
  { id: 'N006', title: 'Monthly Feedback Survey',message: 'Please rate your experience this month. Your feedback helps us improve!', target: 'All Users', type: 'Info',      status: 'Pending',   sentAt: '2025-05-08T12:00:00', sentBy: 'Admin', recipients: 0 },
  { id: 'N007', title: 'Holiday Schedule',       message: 'Buses will run on a Sunday timetable on May 15 due to public holiday.', target: 'All Users', type: 'Info',      status: 'Delivered', sentAt: '2025-05-07T17:00:00', sentBy: 'Admin', recipients: 1240 },
];

// ─── ACTIVITY LOGS ───────────────────────────────────────────────────────────
export const mockActivityLogs = [
  { id: 'L001', action: 'Driver Added',        description: 'New driver Harpreet Kaur (D012) added to the system.',         user: 'Admin', timestamp: '2025-05-10T10:22:00', type: 'create' },
  { id: 'L002', action: 'Bus Status Updated',  description: 'BUS-103 status changed to Maintenance.',                       user: 'Admin', timestamp: '2025-05-10T09:58:00', type: 'update' },
  { id: 'L003', action: 'Notification Sent',   description: 'Emergency alert sent to all users about BUS-103 breakdown.',   user: 'Admin', timestamp: '2025-05-10T07:15:00', type: 'notify' },
  { id: 'L004', action: 'Assignment Updated',  description: 'Driver D009 assigned to BUS-107 for Evening shift on R002.',   user: 'Admin', timestamp: '2025-05-09T17:30:00', type: 'update' },
  { id: 'L005', action: 'Route Modified',      description: 'Route R001 stop list updated — added ITPL Main Gate stop.',    user: 'Admin', timestamp: '2025-05-09T15:45:00', type: 'update' },
  { id: 'L006', action: 'Notification Sent',   description: 'Info notification sent to Route R006 passengers about schedule.',user: 'Admin', timestamp: '2025-05-09T18:00:00', type: 'notify' },
  { id: 'L007', action: 'Driver Deleted',      description: 'Driver record D013 (Kavya Reddy) removed from system.',        user: 'Admin', timestamp: '2025-05-09T11:20:00', type: 'delete' },
  { id: 'L008', action: 'Bus Added',           description: 'New bus BUS-110 (KA10-Q-8901) registered in the system.',      user: 'Admin', timestamp: '2025-05-08T14:00:00', type: 'create' },
  { id: 'L009', action: 'Route Added',         description: 'New route R007 (Rajajinagar – Sarjapur) created.',             user: 'Admin', timestamp: '2025-05-08T10:30:00', type: 'create' },
  { id: 'L010', action: 'Assignment Created',  description: 'Assignment A008 created: D011 → BUS-109 → R007.',              user: 'Admin', timestamp: '2025-05-08T09:00:00', type: 'create' },
  { id: 'L011', action: 'Driver Status Updated',description: 'Driver D003 Anjali Sharma status changed to On Leave.',       user: 'Admin', timestamp: '2025-05-07T16:10:00', type: 'update' },
  { id: 'L012', action: 'Notification Sent',   description: 'Holiday schedule notification sent to all users.',              user: 'Admin', timestamp: '2025-05-07T17:00:00', type: 'notify' },
];

// ─── DASHBOARD STATS ─────────────────────────────────────────────────────────
export const mockDashboardStats = {
  totalBuses:       mockBuses.length,
  activeBuses:      mockBuses.filter(b => b.status === 'Active').length,
  totalDrivers:     mockDrivers.length,
  assignedRoutes:   mockRoutes.length,
  tripsToday:       68,
  notifications:    mockNotifications.length,
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
  { name: 'Active',      value: mockBuses.filter(b => b.status === 'Active').length,      color: '#0D9488' },
  { name: 'Idle',        value: mockBuses.filter(b => b.status === 'Idle').length,        color: '#0F2044' },
  { name: 'Maintenance', value: mockBuses.filter(b => b.status === 'Maintenance').length, color: '#F59E0B' },
  { name: 'Inactive',    value: mockBuses.filter(b => b.status === 'Inactive').length,    color: '#F43F5E' },
];

// ─── ROUTE TRAFFIC ───────────────────────────────────────────────────────────
export const mockRouteTrafficData = mockRoutes.map(r => ({
  route: r.name.split('–')[0].trim(),
  trips: r.totalTrips,
  passengers: r.activePassengers,
}));

// ─── ADMIN PROFILE ───────────────────────────────────────────────────────────
export const mockAdminProfile = {
  name:     'Kiran Sharma',
  email:    'kiran.sharma@vahanmitra.in',
  phone:    '9988776655',
  role:     'Super Admin',
  location: 'Bengaluru, Karnataka',
  joinedOn: '2023-01-01',
  avatar:   null,
  access: ['Dashboard', 'Drivers', 'Buses', 'Routes', 'Assignments', 'Notifications', 'Activity Logs', 'Settings'],
};
