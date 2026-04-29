import React from 'react';
import { useNexusStore } from '../../store/useNexusStore';
import PRModal from './PRModal';
import IRModal from './IRModal';
import SettingsModal from './SettingsModal';
import NewTransactionModal from './NewTransactionModal';
import ViewPRModal from './ViewPRModal';

const ModalManager: React.FC = () => {
  const { modalOpen, closeModal, modalData } = useNexusStore();

  if (!modalOpen) return null;

  return (
    <>
      <PRModal isOpen={modalOpen === 'PR_MODAL'} onClose={closeModal} />
      <IRModal isOpen={modalOpen === 'IR_MODAL'} onClose={closeModal} />
      <SettingsModal isOpen={modalOpen === 'SETTINGS_MODAL'} onClose={closeModal} />
      <NewTransactionModal isOpen={modalOpen === 'NEW_TRANSACTION_MODAL'} onClose={closeModal} />
      <ViewPRModal isOpen={modalOpen === 'VIEW_PR_MODAL'} onClose={closeModal} pr={modalData} />
    </>
  );
};

export default ModalManager;
