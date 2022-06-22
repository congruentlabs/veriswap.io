import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Main from 'layouts/Main';
import { Swap } from './components';
import { useSearchParams } from 'react-router-dom';

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
