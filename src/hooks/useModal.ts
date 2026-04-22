import { useState, useCallback } from 'react';

export interface ModalState<T = any> {
  isOpen: boolean;
  data: T | null;
}

export function useModal<T = any>() {
  const [modal, setModal] = useState<ModalState<T>>({
    isOpen: false,
    data: null,
  });

  const openModal = useCallback((data: T | null = null) => {
    setModal({
      isOpen: true,
      data,
    });
  }, []);

  const closeModal = useCallback(() => {
    setModal({
      isOpen: false,
      data: null,
    });
  }, []);

  const toggleModal = useCallback(() => {
    setModal((prev) => ({
      isOpen: !prev.isOpen,
      data: prev.isOpen ? null : prev.data,
    }));
  }, []);

  return {
    isOpen: modal.isOpen,
    data: modal.data,
    openModal,
    closeModal,
    toggleModal,
  };
}
