import React from 'react';
import { useNexusStore } from './store/useNexusStore';
import AppLayout from './components/AppLayout';
import LoginPage from './pages/LoginPage';
import ManagementPage from './pages/ManagementPage';
import PurchasePage from './pages/PurchasePage';
import QAQCPage from './pages/QAQCPage';
import StorePage from './pages/StorePage';
import ProductionPage from './pages/ProductionPage';
import ModalManager from './components/modals/ModalManager';
import ToastContainer from './components/ui/ToastContainer';

// Placeholder for remaining pages
const PlaceholderPage = ({ name }: { name: string }) => (
  <div className="card" style={{ padding: '80px 40px', textAlign: 'center', background: 'var(--bg2)', border: '1px dashed var(--border)' }}>
    <div className="flex-center mb-4">
      <div className="pulse-icon">⬡</div>
    </div>
    <h3 style={{ fontSize: '24px', marginBottom: '12px' }}>{name} Dashboard</h3>
    <p style={{ color: 'var(--text3)', maxWidth: '400px', margin: '0 auto' }}>
      This module is part of the next migration phase. System intelligence is currently optimizing the data layer for React.
    </p>
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
        return <PlaceholderPage name="Marketing" />;
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
    <>
      <AppLayout>
        {renderContent()}
      </AppLayout>
      <ModalManager />
      <ToastContainer />
    </>
  );
};

export default App;
