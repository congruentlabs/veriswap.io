import React from 'react';
import { Box, Button, ButtonGroup, Divider, Link } from '@mui/material';
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
