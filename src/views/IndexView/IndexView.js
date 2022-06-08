import React from 'react';
import Box from '@mui/material/Box';
import Main from 'layouts/Main';
import {
  Hero,
} from './components';

const IndexView = () => {
  return (
    <Box sx={{ overflowX: 'hidden' }}>
      <Main>
        <Hero />
      </Main>
    </Box>
  );
};

export default IndexView;
