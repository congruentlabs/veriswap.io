/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const CreateSwapStatus = (state) => {
  if (state && state.status === 'Success') {
    return (
      <Box
        sx={{ width: '100%', padding: 2, textAlign: 'center', backgroundColor: 'background.paper', borderRadius: 2 }}
      >
        <CircularProgress color="success" variant="determinate" value={100} />
        <Typography>Create Swap complete!</Typography>
      </Box>
    );
  }

  if (state && state.status === 'Mining') {
    return (
      <Box
        sx={{ width: '100%', padding: 2, textAlign: 'center', backgroundColor: 'background.paper', borderRadius: 2 }}
      >
        <CircularProgress />
        <Typography>Transaction Pending...</Typography>
      </Box>
    );
  }

  if (state && state.status === 'PendingSignature') {
    return (
      <Box
        sx={{ width: '100%', padding: 2, textAlign: 'center', backgroundColor: 'background.paper', borderRadius: 2 }}
      >
        <CircularProgress color="secondary" />
        <Typography>Waiting for Wallet Signature...</Typography>
      </Box>
    );
  }

  if (state && state.status === 'Exception' && state.errorMessage) {
    return (
      <Box
        sx={{ width: '100%', padding: 2, textAlign: 'center', backgroundColor: 'background.paper', borderRadius: 2 }}
      >
        <CircularProgress color="error" variant="determinate" value={100} />
        <Typography>{state.errorMessage}</Typography>
      </Box>
    );
  }

  return <></>;
};

export default CreateSwapStatus;
