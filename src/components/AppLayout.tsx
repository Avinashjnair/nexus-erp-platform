import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useNexusStore } from '../store/useNexusStore';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { currentRole } = useNexusStore();

  return (
    <div className="flex min-h-screen bg-[var(--bg0)]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 px-8 pt-6 pb-20 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto">
            <Topbar />
            <main>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentRole}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
