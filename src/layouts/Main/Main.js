import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Container from 'components/Container';
import { Footer } from './components';

const Main = ({ children }) => {
  return (
    <Box>
      <main>
        <Box height={{ xs: 58, sm: 66 }} />
        {children}
        <Divider />
      </main>
      <Container paddingY={4}>
        <Footer />
      </Container>
    </Box>
  );
};

Main.propTypes = {
  children: PropTypes.node,
};

export default Main;
