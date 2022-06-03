/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
  useEtherBalance,
  useTokenBalance,
  useEthers,
  getChainName,
  shortenAddress,
  useToken,
  shortenIfAddress,
} from '@usedapp/core';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Torus from '@toruslabs/torus-embed';
import WalletLink from 'walletlink';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import { formatEther, formatUnits, parseUnits } from '@ethersproject/units';

import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

import Typography from '@mui/material/Typography';
// import useMediaQuery from '@mui/material/useMediaQuery';
// import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';

import Container from 'components/Container';
import { Chip } from '@mui/material';
import { useCreateSwap, useExecuteSwap, useCancelSwap, useChangeExecutor } from './hooks';

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
  torus: {
    package: Torus
  },
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

const Hero = () => {
  const theme = useTheme();

  const { activateBrowserWallet, activate, account, chainId } = useEthers();
  
  const [fromToken, setFromToken] = useState('0xee479918Eb7fEfC0C7D4578B28c53b5f8620B977');
  const [receiveToken, setReceiveToken] = useState('0xdA3083e219FB1012BB8CA5fE4eF42f83299b973c');
  const [executor, setExecutor] = useState('0xdA3083e219FB1012BB8CA5fE4eF42f83299b973c');
  const [fromAmount, setFromAmount] = useState('');
  const [creatorAddress, setCreatorAddress] = useState('');
  const [fromActualAmount, setFromActualAmount] = useState('');
  const [fromAmountError, setFromAmountError] = useState('');
  const [fromTokenError, setFromTokenError] = useState('');
  const [receiveTokenError, setReceiveTokenError] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('');
  const [receiveActualAmount, setReceiveActualAmount] = useState('');
  const [receiveAmountError, setReceiveAmountError] = useState('');
  const [addonsRiskChecked, setAddonsRiskChecked] = useState(false);
  const [addonsRequireIdentity, setAddonsRequireIdentity] = useState(false);
  const { state: createSwapState, send: createSwapSend, resetState: createSwapResetState } = useCreateSwap();
  const { state: executeSwapState, send: executeSwapSend, resetState: executeSwapResetState } = useExecuteSwap();
  const { state: cancelSwapState, send: cancelSwapSend, resetState: cancelSwapResetState } = useCancelSwap();
  const { state: changeExecutorState, send: changeExecutorSend, resetState: changeExecutorResetState } = useChangeExecutor();

  const fromTokenInfo = useToken(fromToken);
  const receiveTokenInfo = useToken(receiveToken);
  const fromTokenBalance = useTokenBalance(fromToken, account);

  // const { t } = useTranslation();
  // const isMd = useMediaQuery(theme.breakpoints.up('md'), {
  //   defaultMatches: true,
  // });

  const handleConnect = async () => {
    try {
      const provider = await web3Modal.connect();

      await provider.enable();
      activate(provider);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    activateBrowserWallet();
  }, []);

  const handleChangeExecutor = (e) => {
    try {
      shortenIfAddress(e.target.value);
      setExecutor(e.target.value);
    } catch {
      // do nothing
    }
  };

  const handleChangeFromToken = (e) => {
    try {
      shortenIfAddress(e.target.value);
      setFromToken(e.target.value);
    } catch {
      // do nothing
    }
  };

  const handleChangeReceiveToken = (e) => {
    try {
      shortenIfAddress(e.target.value);
      setReceiveToken(e.target.value);
    } catch {
      // do nothing
    }
  };

  const handleChangeFromAmount = (e) => {
    e.preventDefault();
    try {
      setFromAmountError('');
      const newAmount = e.target.value;
      const parsedAmount = parseUnits(newAmount, fromTokenInfo.decimals);
      if (parsedAmount.gt(fromTokenBalance) || parsedAmount.isNegative()) {
        setFromActualAmount(fromTokenBalance);
        setFromAmount(formatUnits(fromTokenBalance || 0, fromTokenInfo.decimals));
      } else {
        setFromActualAmount(parsedAmount);
        setFromAmount(newAmount);
      }
    } catch (error) {
      setFromAmountError('Invalid Amount');
      console.error(error.message);
    }
  };

  const handleChangeReceiveAmount = (e) => {
    e.preventDefault();
    try {
      const newAmount = e.target.value || 0;
      const parsedAmount = parseUnits(newAmount, receiveTokenInfo.decimals);
      setReceiveActualAmount(parsedAmount);
      setReceiveAmount(newAmount);
    } catch (error) {
      console.error(error.message);
    }
  };

  // const handleChangeAddonsRiskChecked = () => {
  //   setAddonsRiskChecked(!addonsRiskChecked);
  // };

  const handleChangeAddonsRequireIdentity = () => {
    setAddonsRequireIdentity(!addonsRequireIdentity);
  };

  const handleClickFromPercentage = (e, val) => {
    e.preventDefault();
    setFromAmountError('');
    if (fromToken && fromTokenBalance && fromTokenBalance.gt(0)) {
      const newAmount = fromTokenBalance.div(100).mul(val);
      setFromActualAmount(newAmount);
      setFromAmount(formatUnits(newAmount || 0, 18));
    }
  };

  const onSubmitCreateSwap = () => {
    createSwapResetState();
    createSwapSend(fromToken, fromActualAmount, receiveToken, receiveActualAmount, executor, addonsRequireIdentity);
  };

  const onSubmitExecuteSwap = () => {
    createSwapResetState();
    createSwapSend(creatorAddress);
  };

  const onSubmitCancelSwap = () => {
    createSwapResetState();
    createSwapSend();
  };

  const onSubmitChangeExecutorSwap = () => {
    createSwapResetState();
    createSwapSend(executor);
  };

  return (
    <Box
      minHeight={800}
      height={'auto'}
      position={'relative'}
      // sx={{
      //   backgroundColor: theme.palette.alternate.main,
      //   background:
      //     'url(https://assets.maccarianagency.com/backgrounds/img19.jpg) no-repeat center',
      //   backgroundSize: 'cover',
      // }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: 1,
          height: 1,
          backgroundColor: theme.palette.background.default,
          // backgroundImage: `linear-gradient(315deg, ${theme.palette.background.default} 0%, #000000 74%)`,
          opacity: '0.8',
          zIndex: 1,
        }}
      />
      <Container position={'relative'} zIndex={2}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box width={1} height="100%" display="flex" alignItems="center">
              <Box
                component={Card}
                height={1}
                width={1}
                borderRadius={0}
                boxShadow={0}
                style={{ backgroundColor: theme.palette.background.default }}
              >
                <Box
                  component={CardMedia}
                  height={1}
                  width={1}
                  minHeight={300}
                  style={{ backgroundColor: theme.palette.background.default }}
                  image="logo-full.png"
                />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box width={1} height="100%" display="flex" alignItems="center">
              <Box
                padding={{ xs: 3, sm: 6 }}
                width={1}
                component={Card}
                borderRadius={2}
                boxShadow="rgb(100 221 23 / 60%) 0px 0px 31.25rem 1rem"
                // data-aos={'zoom-in'}
              >
                {!account && (
                  <Box display="flex" flexDirection={'column'}>
                    <Box marginBottom={4}>
                      <Button
                        sx={{ height: 54 }}
                        variant="contained"
                        // color="default"
                        size="medium"
                        style={{ fontWeight: 900 }}
                        fullWidth
                        onClick={handleConnect}
                      >
                        CONNECT WALLET
                      </Button>
                    </Box>
                  </Box>
                )}
                <Box>
                  <Typography component="p" variant="body1" align="center">
                    {account ? `Connected to: ${shortenAddress(account)}` : 'Connect to your Wallet to start using Veriswap!'}
                  </Typography>
                </Box>
                {chainId && (
                  <Box marginBottom={4}>
                    <Typography component="p" variant="body1" align="center">
                      Network: {getChainName(chainId)}
                    </Typography>
                  </Box>
                )}
                <form
                  noValidate
                  autoComplete="off"
                  onSubmit={onSubmitCreateSwap}
                >
                  <Box display="flex" flexDirection={'column'}>
                    <Box marginBottom={2}>
                      <TextField
                        sx={{ height: 54 }}
                        label="Token to Send"
                        variant="outlined"
                        color="primary"
                        size="medium"
                        disabled={!account}
                        fullWidth
                        value={fromToken}
                        onChange={handleChangeFromToken}
                        error={fromTokenError !== ''}
                        helperText={fromTokenError}
                      />
                    </Box>
                    <Box marginBottom={0.5}>
                      <TextField
                        sx={{ height: 54 }}
                        label="Amount to Send"
                        variant="outlined"
                        color="primary"
                        size="medium"
                        disabled={!account}
                        fullWidth
                        value={fromAmount}
                        onChange={handleChangeFromAmount}
                        error={fromAmountError !== ''}
                        helperText={fromAmountError}
                      />
                    </Box>
                    <Box marginBottom={2}>
                      <ButtonGroup variant="contained" color="secondary" fullWidth size="small">
                        <Button onClick={(e) => handleClickFromPercentage(e, 25)}>
                          25%
                        </Button>
                        <Button onClick={(e) => handleClickFromPercentage(e, 50)}>
                          50%
                        </Button>
                        <Button onClick={(e) => handleClickFromPercentage(e, 75)}>
                          75%
                        </Button>
                        <Button onClick={(e) => handleClickFromPercentage(e, 100)}>
                          100%
                        </Button>
                      </ButtonGroup>
                    </Box>
                    {account && fromTokenInfo && fromTokenBalance && (
                      <Box textAlign="center">
                        <Chip label={`Balance: ${formatEther(fromTokenBalance, fromTokenInfo.decimals)} ${fromTokenInfo.symbol}`} />
                      </Box>
                    )}
                    <Box marginY={4} marginX={{ xs: -3, sm: -6 }}>
                      <Divider />
                    </Box>
                    <Box marginBottom={2}>
                      <TextField
                        sx={{ height: 54 }}
                        label="Token to Receive"
                        variant="outlined"
                        color="primary"
                        size="medium"
                        disabled={!account}
                        fullWidth
                        value={receiveToken}
                        onChange={handleChangeReceiveToken}
                        error={receiveTokenError !== ''}
                        helperText={receiveTokenError}
                      />
                    </Box>
                    <Box marginBottom={1}>
                      <TextField
                        sx={{ height: 54 }}
                        label="Amount to Receive"
                        variant="outlined"
                        color="primary"
                        size="medium"
                        fullWidth
                        value={receiveAmount}
                        onChange={handleChangeReceiveAmount}
                        error={receiveAmountError !== ''}
                        helperText={receiveAmountError}
                      />
                    </Box>
                    {account && receiveTokenInfo && (
                      <Box textAlign="center">
                        <Chip label={`Receiving: ${receiveAmount} ${receiveTokenInfo.symbol}`} />
                      </Box>
                    )}
                    <Box marginY={4} marginX={{ xs: -3, sm: -6 }}>
                      <Divider />
                    </Box>
                    <Box marginBottom={2}>
                      <TextField
                        sx={{ height: 54 }}
                        label="Executor"
                        variant="outlined"
                        color="primary"
                        size="medium"
                        disabled={!account}
                        fullWidth
                        value={executor}
                        onChange={handleChangeExecutor}
                      />
                    </Box>
                    <Box marginBottom={4}>
                      <FormGroup>
                        {/* <FormControlLabel
                            control={(
                              <Switch
                                checked={addonsRiskChecked}
                                disabled={!account}
                                onChange={handleChangeAddonsRiskChecked}
                              />
                            )}
                            label="Enforce Risk Detection"
                          /> */}
                        <FormControlLabel
                          control={(
                            <Switch
                              checked={addonsRequireIdentity}
                              disabled={!account}
                              onChange={handleChangeAddonsRequireIdentity}
                            />
                          )}
                          label="Require Signata Identity"
                        />
                      </FormGroup>
                    </Box>
                    <Box>
                      <ButtonGroup
                        fullWidth
                        size="medium"
                        sx={{ height: 54 }}
                      >
                        <Button
                          sx={{ height: 54 }}
                          variant="contained"
                          color="primary"
                          size="large"
                          style={{ fontWeight: 900 }}
                          fullWidth
                          type="submit"
                          endIcon={<SwapHorizIcon />}
                        >
                          OPEN
                        </Button>
                      </ButtonGroup>
                    </Box>
                  </Box>
                </form>
                <Box marginY={4} marginX={{ xs: -3, sm: -6 }}>
                  <Divider />
                </Box>
                <Box>
                  <Typography component="p" variant="body2" align="left">
                    By using Veriswap you agree to our{' '}
                    <Box
                      component="a"
                      href=""
                      color={theme.palette.text.primary}
                      fontWeight={'700'}
                    >
                      Privacy Policy
                    </Box>
                    {' '}and{' '}
                    <Box
                      component="a"
                      href=""
                      color={theme.palette.text.primary}
                      fontWeight={'700'}
                    >
                      Terms &amp; Conditions
                    </Box>
                      .
                  </Typography>
                </Box>
                
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;
