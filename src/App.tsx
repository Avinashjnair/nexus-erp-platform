import React from 'react';
import { useNexusStore } from './store/useNexusStore';
import AppLayout from './components/AppLayout';
import LoginPage from './pages/LoginPage';
import ManagementPage from './pages/ManagementPage';
// Placeholder for other pages
const PlaceholderPage = ({ name }: { name: string }) => (
  <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
    <h3>{name} Dashboard</h3>
    <p>This module is currently being migrated to React...</p>
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
      case 'qaqc':
        return <PlaceholderPage name="QA / QC" />;
      case 'purchase':
        return <PlaceholderPage name="Procurement" />;
      case 'production':
        return <PlaceholderPage name="Production" />;
      case 'store':
        return <PlaceholderPage name="Warehouse" />;
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
    <AppLayout>
      {renderContent()}
    </AppLayout>
  );
};

export default App;
