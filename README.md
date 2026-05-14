# 🚌 Vahan Mitra | Transport Management Dashboard

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

**Vahan Mitra** is an intelligent transport management platform designed for modern fleet operations. It provides a comprehensive dashboard to manage drivers, buses, routes, and assignments with real-time analytics and tracking.

---

## ✨ Key Features

- **📊 Advanced Analytics Dashboard**: Real-time overview of fleet status, active routes, and performance metrics using interactive charts.
- **👨‍✈️ Driver Management**: Comprehensive database for driver profiles, status tracking, and performance monitoring.
- **🚌 Fleet Inventory**: Centralized management of buses, including maintenance status and availability.
- **🗺️ Route Optimization**: Detailed route management with distance tracking and point-to-point visualization.
- **📅 Dynamic Assignments**: Seamlessly assign drivers and vehicles to specific routes with conflict detection.
- **🔔 Notification System**: Stay updated with system alerts and operational notifications.
- **📜 Activity Logs**: Full audit trail of all administrative actions for transparency and security.
- **🎨 Modern UI/UX**: Premium, responsive design built with Tailwind CSS and Framer Motion for smooth interactions.

---

## 🛠️ Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Backend-as-a-Service**: Supabase (Database & Authentication)
- **Data Tables**: TanStack Table (React Table v8)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- A Supabase account and project

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/vahan-mitra-admin.git
   cd vahan-mitra-admin
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```text
src/
├── components/     # Reusable UI, Layout, and Chart components
├── context/        # Global state management (AppContext)
├── data/           # Mock data and constants
├── pages/          # Main application views (Dashboard, Drivers, etc.)
├── utils/          # Helper functions and Supabase client
├── App.jsx         # Main routing and provider setup
└── main.jsx        # Entry point
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ by the Vahan Mitra Team.