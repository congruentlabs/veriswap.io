/* eslint-disable react/no-unescaped-entities */
import React, { useEffect } from 'react';
import { useEthers } from '@usedapp/core';
import { useTheme } from '@mui/material/styles';
import WalletLink from 'walletlink';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { Stack, Alert, AlertTitle, Typography, Box, Button } from '@mui/material';

const infuraId = 'dab56da72e89492da5a8e77fbc45c7fa';

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId
    }
  },
  binancechainwallet: {
    package: true
  },
  // torus: {
  //   package: Torus
  // },
  walletlink: {
    package: WalletLink,
    options: {
      appName: 'Veriswap',
      infuraId
    }
  },
  coinbasewallet: {
    package: CoinbaseWalletSDK, // Required
    options: {
      appName: 'Veriswap', // Required
      infuraId, // Required
      rpc: '', // Optional if `infuraId` is provided; otherwise it's required
      chainId: 1, // Optional. It defaults to 1 if not provided
      darkMode: false // Optional. Use dark theme, defaults to false
    }
  }
};

const web3Modal = new Web3Modal({
  providerOptions
});

const AccountConnector = () => {
  const theme = useTheme();
  const { activateBrowserWallet, activate } = useEthers();

  useEffect(() => {
    activateBrowserWallet();
  }, [activateBrowserWallet]);

  const handleConnect = async () => {
    try {
      const provider = await web3Modal.connect();

      await provider.enable();
      activate(provider);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Stack spacing={2} alignItems="center">
      <img src="/logo-full.png" width="100%" alt="Veriswap Logo" />
      <Alert severity="warning" sx={{ width: '100%' }}>
        Connect your wallet to start using Veriswap!
      </Alert>
      <Alert severity="error" sx={{ width: '100%' }}>
        <AlertTitle>App Under Development</AlertTitle>
        This app is currently under active development and may not work properly. Use at your own peril.
      </Alert>
      <Button
        variant="contained"
        // color="default"
        size="large"
        style={{ fontWeight: 900 }}
        fullWidth
        onClick={handleConnect}
      >
        CONNECT WALLET
      </Button>
      <Typography component="p" variant="body2" align="left">
        By using Veriswap you agree to our{' '}
        <Box component="a" href="" color={theme.palette.text.primary} fontWeight={'700'}>
          Privacy Policy
        </Box>{' '}
        and{' '}
        <Box component="a" href="" color={theme.palette.text.primary} fontWeight={'700'}>
          Terms &amp; Conditions
        </Box>
        .
      </Typography>
    </Stack>
  );
};

export default AccountConnector;
