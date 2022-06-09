/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { AlertTitle, Alert } from '@mui/material';

const CreateSwapStatus = (state) => {
  if (state && state.status === 'Success') {
    return (
      <Alert severity="success">
        <AlertTitle>Create Swap Complete!</AlertTitle>
      </Alert>
    );
  }

  if (state && state.status === 'Mining') {
    return (
      <Alert severity="info">
        <AlertTitle>Transaction Pending...</AlertTitle>
      </Alert>
    );
  }
    
  if (state && state.status === 'PendingSignature') {
    return (
      <Alert severity="info">
        <AlertTitle>Waiting for Wallet Signature</AlertTitle>
      </Alert>
    );
  }
    
  if (state && state.status === 'Exception') {
    return (
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        {state.errorMessage}
      </Alert>
    );
  }

  return <></>;
};

export default CreateSwapStatus;
