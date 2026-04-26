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
import WorkflowPage from './pages/WorkflowPage';
import ReportsPage from './pages/ReportsPage';
import InitiatePage from './pages/InitiatePage';
import ModalManager from './components/modals/ModalManager';
import ToastContainer from './components/ui/ToastContainer';

const App: React.FC = () => {
  const { currentUser, currentRole } = useNexusStore();

  if (!currentUser) {
    return <LoginPage />;
  }

  const renderContent = () => {
    switch (currentRole) {
      case 'management':  return <ManagementPage />;
      case 'purchase':    return <PurchasePage />;
      case 'qaqc':        return <QAQCPage />;
      case 'store':       return <StorePage />;
      case 'production':  return <ProductionPage />;
      case 'marketing':   return <MarketingPage />;
      case 'workflow':    return <WorkflowPage />;
      case 'reports':     return <ReportsPage />;
      case 'initiate':    return <InitiatePage />;
      default:            return <ManagementPage />;
    }
  };

  return (
    <>
      <AppLayout>{renderContent()}</AppLayout>
      <ModalManager />
      <ToastContainer />
    </>
  );
};

export default App;
