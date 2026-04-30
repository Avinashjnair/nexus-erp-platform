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
import { ErrorBoundary } from './components/ErrorBoundary';
import type { RoleId } from './types/erp';

const PAGE_MAP: Record<RoleId, React.ReactElement> = {
  management: <ManagementPage />,
  purchase:   <PurchasePage />,
  qaqc:       <QAQCPage />,
  store:      <StorePage />,
  production: <ProductionPage />,
  marketing:  <MarketingPage />,
  workflow:   <WorkflowPage />,
  reports:    <ReportsPage />,
  initiate:   <InitiatePage />,
  strategic:  <StrategicDashboard />,
  digest:     <ActivityDigestPage />,
};

const App: React.FC = () => {
  const { currentUser, currentRole, projectControls, addNotification } = useNexusStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (projectControls.spi < 0.85) {
        addNotification({
          type: 'error',
          title: 'NEURAL ALERT: Schedule Variance',
          text: `Project P2 SPI has dropped to ${projectControls.spi}. Immediate intervention recommended.`,
        });
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [projectControls.spi, addNotification]);

  if (!currentUser) {
    return <LoginPage />;
  }

  const page = PAGE_MAP[currentRole] ?? PAGE_MAP.management;
  const moduleName = currentRole.charAt(0).toUpperCase() + currentRole.slice(1);

  return (
    <>
      <AppLayout>
        <ErrorBoundary moduleName={moduleName}>
          {page}
        </ErrorBoundary>
      </AppLayout>
      <ModalManager />
      <ToastContainer />
    </>
  );
};

export default App;
