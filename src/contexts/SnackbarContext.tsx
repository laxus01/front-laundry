import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface SnackbarMessage {
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface SnackbarContextType {
  showSnackbar: (message: string, severity: 'success' | 'error' | 'warning' | 'info', duration?: number) => void;
  snackbarState: {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
    duration: number;
  };
  closeSnackbar: () => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

interface SnackbarProviderProps {
  children: ReactNode;
}

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ children }) => {
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: '',
    severity: 'info' as 'success' | 'error' | 'warning' | 'info',
    duration: 6000,
  });

  const showSnackbar = (
    message: string,
    severity: 'success' | 'error' | 'warning' | 'info',
    duration: number = 6000
  ) => {
    setSnackbarState({
      open: true,
      message,
      severity,
      duration,
    });
  };

  const closeSnackbar = () => {
    setSnackbarState(prev => ({
      ...prev,
      open: false,
    }));
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar, snackbarState, closeSnackbar }}>
      {children}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = (): SnackbarContextType => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};
