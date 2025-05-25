'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface QuickCreateContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const QuickCreateContext = createContext<QuickCreateContextType | undefined>(undefined);

interface QuickCreateProviderProps {
  children: ReactNode;
}

export function QuickCreateProvider({ children }: QuickCreateProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const contextValue: QuickCreateContextType = {
    isOpen,
    openModal,
    closeModal,
  };

  return (
    <QuickCreateContext.Provider value={contextValue}>
      {children}
    </QuickCreateContext.Provider>
  );
}

export function useQuickCreate() {
  const context = useContext(QuickCreateContext);
  if (context === undefined) {
    throw new Error('useQuickCreate must be used within a QuickCreateProvider');
  }
  return context;
} 