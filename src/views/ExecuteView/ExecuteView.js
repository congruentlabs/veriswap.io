import React from 'react';
import Box from '@mui/material/Box';
import Main from 'layouts/Main';
import { Execute } from './components';
import { useParams } from 'react-router-dom';

const ExecuteView = () => {
  const { swapId } = useParams();

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      <Main>
        <Execute swapId={swapId} />
      </Main>
    </Box>
  );
};

export default ExecuteView;
