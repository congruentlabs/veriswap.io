import React from 'react';
import { Alert, AlertTitle, Stack } from '@mui/material';

const InvalidSwap = () => {
  return (
    <Stack spacing={2} alignItems="center">
      <img src="/logo-full.png" width="200" alt="Veriswap Logo" />
      <Alert severity="warning" sx={{ width: '100%' }}>
        <AlertTitle>Invalid Swap URL</AlertTitle>
        Please check that the URL of your swap is correct.
      </Alert>
    </Stack>
  );
};

export default InvalidSwap;
