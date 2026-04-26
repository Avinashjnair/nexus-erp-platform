import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { AnimatePresence, motion } from 'framer-motion';
import { useNexusStore } from '../store/useNexusStore';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { currentRole } = useNexusStore();

  return (
    <div className="nexus-app">
      <Sidebar />
      <div className="content-area">
        <Topbar />
        <div className="page-scroll">
          <AnimatePresence>
            <motion.div
              key={currentRole}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
