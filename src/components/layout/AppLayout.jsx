import { Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar  from './Navbar';
import { Toaster } from 'react-hot-toast';

export default function AppLayout() {
  const location = useLocation();
  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Global Toast container */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: { borderRadius: '12px', fontSize: '13px', fontFamily: 'Inter, sans-serif' },
          success: { iconTheme: { primary: '#0D9488', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#E11D48', secondary: '#fff' } },
        }}
      />
    </div>
  );
}
