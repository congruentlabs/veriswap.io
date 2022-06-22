import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Main from 'layouts/Main';
import { Execute } from './components';
import { useSearchParams } from 'react-router-dom';

const ExecuteView = () => {
  const [searchParams] = useSearchParams();
  const [swapId, setSwapId] = useState('');

  useEffect(() => {
    if (searchParams) {
      const swapToCheck = searchParams.get('swapId');
      if (swapToCheck) {
        setSwapId(swapToCheck);
      }
    }
  }, [searchParams]);

  searchParams.get('swap');
  return (
    <Box sx={{ overflowX: 'hidden' }}>
      <Main>
        <Execute />
      </Main>
    </Box>
  );
};

export default ExecuteView;
