import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useSnackbar } from '../contexts/SnackbarContext';

const GlobalSnackbar: React.FC = () => {
  const { snackbarState, closeSnackbar } = useSnackbar();

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    closeSnackbar();
  };

  return (
    <Snackbar
      open={snackbarState.open}
      autoHideDuration={snackbarState.duration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        onClose={handleClose}
        severity={snackbarState.severity}
        variant="filled"
        sx={{ 
          width: '100%',
          '&.MuiAlert-filledSuccess': {
            backgroundColor: '#9fb404',
            color: '#ffffff'
          }
        }}
      >
        {snackbarState.message}
      </Alert>
    </Snackbar>
  );
};

export default GlobalSnackbar;
