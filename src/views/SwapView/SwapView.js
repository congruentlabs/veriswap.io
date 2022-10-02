import React from 'react';
import Box from '@mui/material/Box';
import Main from 'layouts/Main';
import { Swap } from './components';

const SwapView = () => {
  return (
    <Box sx={{ overflowX: 'hidden' }}>
      <Main>
        <Swap />
      </Main>
    </Box>
  );
};

export default SwapView;
