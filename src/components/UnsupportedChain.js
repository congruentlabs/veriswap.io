import React from 'react';
import { Grid, Stack, Alert, AlertTitle } from '@mui/material';

function UnsupportedChain({ SUPPORTED_CHAINS }) {
  return (
    // <Grid item xs={12} md={6}>
    //   <Stack spacing={2}>
    <Alert severity="warning">
      <AlertTitle>Unsupported Chain</AlertTitle>
      Connect to a supported chain to use Veriswap. Veriswap currently supports these chains:
      <ul>
        {SUPPORTED_CHAINS.map((c) => (
          <li key={c.chainId}>{c.chainName}</li>
        ))}
      </ul>
    </Alert>
    //   </Stack>
    // </Grid>
  );
}

export default UnsupportedChain;
