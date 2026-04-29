import React, { useEffect } from 'react';
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
import StrategicDashboard from './pages/StrategicDashboard';
import ActivityDigestPage from './pages/ActivityDigestPage';
import ModalManager from './components/modals/ModalManager';
import ToastContainer from './components/ui/ToastContainer';

const App: React.FC = () => {
  const { currentUser, currentRole, projectControls, addNotification } = useNexusStore();

  useEffect(() => {
    // Neural Alert System: Monitor KPIs
    const timer = setTimeout(() => {
      if (projectControls.spi < 0.85) {
        addNotification({
          type: 'error',
          title: 'NEURAL ALERT: Schedule Variance',
          text: `Project P2 SPI has dropped to ${projectControls.spi}. Immediate intervention recommended.`
        });
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [projectControls.spi, addNotification]);

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
      case 'strategic':   return <StrategicDashboard />;
      case 'digest':      return <ActivityDigestPage />;
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
