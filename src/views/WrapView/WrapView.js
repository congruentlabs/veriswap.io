import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Main from 'layouts/Main';
import { Wrap } from './components';

const SwapView = () => {
  return (
    <Box sx={{ overflowX: 'hidden' }}>
      <Main>
        <Wrap />
      </Main>
    </Box>
  );
};

export default SwapView;
