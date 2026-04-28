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
      {/* Background Depth Layer */}
      <div className="fixed inset-0 pointer-events-none opacity-20" 
           style={{ 
             background: `radial-gradient(circle at 0% 0%, var(--violet-dim) 0%, transparent 50%), 
                          radial-gradient(circle at 100% 100%, var(--neon-dim) 0%, transparent 50%)` 
           }} 
      />
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
