import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';

const Topbar = () => {
  // const {
  //   landings: landingPages,
  // } = pages;

  return (
    <Box
      display={'flex'}
      justifyContent={'space-between'}
      alignItems={'center'}
      width={1}
    >
      <Box
        display={'flex'}
        component="a"
        href="/"
        title="Signata"
        width={{ xs: 100, md: 120 }}
      >
        <Box
          component={'img'}
          src="logo.png"
          height={0.4}
          width={0.4}
        />
      </Box>
    </Box>
  );
};

Topbar.propTypes = {
  onSidebarOpen: PropTypes.func,
  pages: PropTypes.object,
};

export default Topbar;
