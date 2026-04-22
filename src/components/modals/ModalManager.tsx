import React from 'react';
import { useNexusStore } from '../../store/useNexusStore';
import PRModal from './PRModal';
import IRModal from './IRModal';

const ModalManager: React.FC = () => {
  const { modalOpen, closeModal } = useNexusStore();

  if (!modalOpen) return null;

  return (
    <>
      <PRModal isOpen={modalOpen === 'PR_MODAL'} onClose={closeModal} />
      <IRModal isOpen={modalOpen === 'IR_MODAL'} onClose={closeModal} />
    </>
  );
};

export default ModalManager;
