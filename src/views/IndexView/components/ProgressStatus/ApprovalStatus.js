/* eslint-disable react/no-unescaped-entities */
// import React from 'react';
import { AlertTitle, Alert } from '@mui/material';

const ApprovalStatus = (state) => {
  // no success message for approvals

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

export default ApprovalStatus;
