import React from 'react';
import { useNexusStore } from './store/useNexusStore';
import AppLayout from './components/AppLayout';
import LoginPage from './pages/LoginPage';
import ManagementPage from './pages/ManagementPage';
import PurchasePage from './pages/PurchasePage';
import QAQCPage from './pages/QAQCPage';
import StorePage from './pages/StorePage';
import ProductionPage from './pages/ProductionPage';
import MarketingPage from './pages/MarketingPage';
import { ThemeProvider } from './components/ThemeProvider';
import ModalManager from './components/modals/ModalManager';
import ToastContainer from './components/ui/ToastContainer';
import Badge from './components/ui/Badge';

// Placeholder for remaining pages
const PlaceholderPage = ({ name }: { name: string }) => (
  <div className="bg-card rounded-2xl border border-border-subtle p-20 text-center animate-in shadow-sm">
    <div className="text-5xl text-primary mb-6 opacity-30">⬡</div>
    <h2 className="text-2xl font-black text-text-primary mb-4 tracking-tight">{name} Intelligence</h2>
    <p className="text-sm text-text-secondary leading-relaxed max-w-lg mx-auto mb-10">
      The <strong className="text-text-primary">{name}</strong> module is currently being optimized for the new <span className="text-primary font-bold">Aeon Ledger</span> architecture. 
      Real-time data synchronization and high-performance visualizations will be active in the next release cycle.
    </p>
    <div className="flex justify-center">
      <Badge variant="info">SYSTEM OPTIMIZATION IN PROGRESS</Badge>
    </div>
  </div>
);

const App: React.FC = () => {
  const { currentUser, currentRole } = useNexusStore();

  if (!currentUser) {
    return <LoginPage />;
  }

  const renderContent = () => {
    switch (currentRole) {
      case 'management':
        return <ManagementPage />;
      case 'purchase':
        return <PurchasePage />;
      case 'qaqc':
        return <QAQCPage />;
      case 'store':
        return <StorePage />;
      case 'production':
        return <ProductionPage />;
      case 'marketing':
        return <MarketingPage />;
      case 'workflow':
        return <PlaceholderPage name="Workflow" />;
      case 'reports':
        return <PlaceholderPage name="Reports" />;
      case 'initiate':
        return <PlaceholderPage name="Project Initiation" />;
      default:
        return <ManagementPage />;
    }
  };

  return (
    <ThemeProvider>
      <div className="nexus-app">
        <AppLayout>
          {renderContent()}
        </AppLayout>
        <ModalManager />
        <ToastContainer />
      </div>
    </ThemeProvider>
  );
};

export default App;
