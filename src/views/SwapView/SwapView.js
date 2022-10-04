import React from 'react';
import { Box, Button, ButtonGroup, Divider, Link } from '@mui/material';
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
