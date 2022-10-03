/* eslint-disable no-unused-vars */
import React from 'react';
import { useEthers } from '@usedapp/core';
import axios from 'axios';
// import Torus from '@toruslabs/torus-embed';
import { useTheme } from '@mui/material/styles';
import { Stack, Box, Card, Typography, Link, Alert, Divider, Tabs, Tab } from '@mui/material';
import Container from 'components/Container';
import AccountConnector from 'components/AccountConnector';
import ConnectedWallet from 'components/ConnectedWallet';
import VSATA from '../vSATA';
import VUSDT from '../vUSDT';
import VUSDC from '../vUSDC';
import VDAI from '../vDAI';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

const Wrap = () => {
  const theme = useTheme();
  const { account, chainId } = useEthers();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box minHeight={800} height={'auto'} position={'relative'}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: 1,
          height: 1,
          // backgroundColor: theme.palette.background.default,
          backgroundImage: `linear-gradient(315deg, ${theme.palette.background.default} 0%, #000000 74%)`,
          opacity: '0.8',
          zIndex: 1
        }}
      />
      <Container maxWidth="sm" zIndex="2" position="relative">
        {account && <ConnectedWallet account={account} />}
        <Box width={1} height="100%" display="flex" alignItems="center">
          <Box
            padding={{ xs: 2, sm: 6 }}
            width={1}
            component={Card}
            borderRadius={2}
            boxShadow="rgb(100 221 23 / 60%) 0px 0px 31.25rem 1rem"
            // data-aos={'zoom-in'}
          >
            {!account && <AccountConnector />}
            {account && chainId !== 1 && (
              <Stack spacing={2} alignItems="center">
                <Typography variant="h3" align="center" sx={{ fontWeight: 700 }}>
                  Wrap to Verified Assets
                </Typography>
                <Alert severity="error">This feature only currently supports the Ethereum mainnet network.</Alert>
                <img src="/logo-full.png" width="200" alt="Veriswap Logo" />
              </Stack>
            )}
            {account && chainId === 1 && (
              <Stack spacing={2} alignItems="center">
                <Typography variant="h3" align="center" sx={{ fontWeight: 700 }}>
                  Wrap to Verified Assets
                </Typography>
                <Typography variant="body1" align="center">
                  Wrap assets into KYC-enforcing versions. These tokens can be moved anywhere, but can only be wrapped
                  and unwrapped by Signata KYC-Verified users. If you want your asset available on this site raise a
                  request on{' '}
                  <Link href="https://github.com/congruentlabs/veriswap.io/issues" target="_blank">
                    the Veriswap GitHub
                  </Link>
                  .
                </Typography>
                <img src="/logo-full.png" width="200" alt="Veriswap Logo" />
              </Stack>
            )}
            {account && chainId === 1 && (
              <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                <Tabs value={value} onChange={handleChange} centered>
                  <Tab label="vSATA" />
                  <Tab label="vUSDT" />
                  <Tab label="vUSDC" />
                  <Tab label="vDAI" />
                </Tabs>
                <TabPanel value={value} index={0}>
                  <VSATA />
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <VUSDT />
                </TabPanel>
                <TabPanel value={value} index={2}>
                  <VUSDC />
                </TabPanel>
                <TabPanel value={value} index={3}>
                  <VDAI />
                </TabPanel>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Wrap;
