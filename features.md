# Vahan Mitra Admin: Feature Specification

This document details the purpose and feature set of each section within the Vahan Mitra Admin dashboard.

---

## 📊 Dashboard (Overview)
**Purpose**: Central hub for real-time monitoring and high-level analytics of the transport fleet.

- **Quick Actions**: Instant access to primary workflows (Add Driver, Register Bus, Create Route, Send Notification).
- **Summary Statistics**: 
  - Real-time counts of Total/Active Buses and Drivers.
  - Snapshot of operational Routes and Trips completed today.
  - Weekly notification count.
- **Advanced Analytics (Visualized via Recharts)**:
  - **Weekly Trip Overview**: Area chart showing daily trip frequency and passenger load.
  - **Bus Fleet Status**: Donut chart breakdown of operational states (Active, Idle, Maintenance, Inactive).
  - **Route Traffic Analysis**: Bar chart identifying high-demand routes.
- **Activity Feed**: Live timeline of the most recent administrative actions.
- **Notification Preview**: List of the latest system-wide alerts sent to the fleet/passengers.

---

## 👨‍✈️ Driver Management
**Purpose**: Comprehensive database and lifecycle management for all transport personnel.

- **Driver Inventory**: Tabular view of drivers with name, contact info, license number, and experience.
- **CRUD Operations**: Add new driver profiles, edit existing details, or remove drivers from the system.
- **Status Lifecycle**: Track drivers through various states: *Active*, *On Leave*, *Inactive*, or *Training*.
- **Search & Filter**: Real-time filtering by name, ID, or license number; categorized filtering by employment status.
- **Performance Metrics**: View total trips completed by each driver.

---

## 🚌 Bus Management
**Purpose**: Centralized registry and monitoring of the vehicle fleet.

- **Fleet Inventory**: List of all vehicles with Registration Number, Model, Seating Capacity, and Fuel Type.
- **View Toggles**: Switch between a high-density **Table View** and a visual **Card View**.
- **CRUD Operations**: Register new buses, update vehicle specifications, or decommission old units.
- **Operational Status**: Real-time tracking of vehicle availability (*Active*, *Idle*, *Maintenance*, *Inactive*).
- **Search & Filter**: Quick search by Bus ID or Plate Number; filter by maintenance/operational status.

---

## 🗺️ Route Management
**Purpose**: Logic and logistics layer for defining transport paths.

- **Route Directory**: Overview of all operational routes including distance and total stops.
- **Detailed Route View**:
  - **Route Metadata**: Distance, total stops, active passenger counts, and lifetime trips.
  - **Stops Timeline**: Chronological visualization of all stops along the path.
  - **Active Fleet**: Live list of buses currently assigned to the specific route.
- **Search**: Search routes by name or start/end points.

---

## 📅 Assignments
**Purpose**: Operational bridge connecting Drivers, Vehicles, and Routes.

- **Assignment Mapping**: Dynamic form to link a specific **Driver** and **Bus** to a **Route**.
- **Scheduling**:
  - **Shift Management**: Assign to specific shifts (Morning, Afternoon, Evening, Night).
  - **Time Slots**: Define precise start and end times for the assignment.
- **Active Tracker**: Visual cards showing currently active assignments with quick unassign (delete) capability.
- **Status Indicators**: Differentiate between *Active*, *Scheduled*, and *Completed* assignments.

---

## 🔔 Notification System
**Purpose**: Communication engine for sending alerts to drivers, passengers, or system-wide.

- **Alert Composer**: Multi-functional form to send notifications with custom titles and messages.
- **Targeting**: Ability to target specific groups (e.g., Drivers, Passengers, All).
- **Notification Log**: History of all sent alerts with recipient metrics and timestamps.
- **Visual Feedback**: Integration with `react-hot-toast` for immediate administrative confirmation.

---

## 📜 Activity Logs
**Purpose**: Immutable audit trail for system security and administrative transparency.

- **Audit Feed**: Chronological list of all mutations (Create, Update, Delete) performed in the system.
- **Log Categories**: Categorized by action type (e.g., *Driver Added*, *Bus Maintenance Updated*, *Route Deleted*).
- **Metadata Tracking**: Captures the timestamp, performing user (Admin), and a detailed description of the change.

---

## ⚙️ Account & Settings
- **Profile**: Manage administrative account details and credentials.
- **System Settings**: Global configuration for language, theme preferences, and system-wide notifications.
