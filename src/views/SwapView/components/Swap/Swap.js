/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
  useEtherBalance,
  useTokenBalance,
  useEthers,
  shortenAddress,
  useToken,
  shortenIfAddress,
  DEFAULT_SUPPORTED_CHAINS
} from '@usedapp/core';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
// import Torus from '@toruslabs/torus-embed';
import WalletLink from 'walletlink';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import { formatEther, formatUnits, parseUnits } from '@ethersproject/units';
import { Contract } from '@ethersproject/contracts';

// import useMediaQuery from '@mui/material/useMediaQuery';
// import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import {
  Alert,
  AlertTitle,
  LinearProgress,
  Box,
  TextField,
  Button,
  ButtonGroup,
  Divider,
  Chip,
  Typography,
  Card,
  FormGroup,
  Stack,
  FormControlLabel,
  Switch
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import DoneIcon from '@mui/icons-material/Done';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import Container from 'components/Container';
import {
  useCreateSwap,
  useExecuteSwap,
  useCancelSwap,
  useChangeExecutor,
  useApprove,
  useGetSingleValue
} from '../../../hooks';
import ApprovalStatus from 'components/ApprovalStatus';
import CreateSwapStatus from 'components/CreateSwapStatus';

import SWAP_ABI from '../../../swapAbi.json';
import ID_ABI from '../../../idAbi.json';

const infuraId = 'dab56da72e89492da5a8e77fbc45c7fa';
const SWAP_CONTRACT = '0x2bBB08e5BeCd636b15D8E8de0DCcb98923a2Daad'; // rinkeby
const swapContract = new Contract(SWAP_CONTRACT, SWAP_ABI);
const ID_CONTRACT = '0xb24e28a4b7fed6d59d3bd06af586f02fddfa6385';
const idContract = new Contract(ID_CONTRACT, ID_ABI);

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

const Swap = () => {
  const theme = useTheme();

  const { activateBrowserWallet, activate, account, chainId } = useEthers();

  const [fromToken, setFromToken] = useState('0x55AE81a393c7485e14b2c1C70308dC226cc44636');
  const [receiveToken, setReceiveToken] = useState('0x55AE81a393c7485e14b2c1C70308dC226cc44636');
  const [executor, setExecutor] = useState('0x788DdE8Ca5b196ba47138DB6C0527f54B5959D51');
  const [fromAmount, setFromAmount] = useState('');
  const [creatorAddress, setCreatorAddress] = useState('');
  const [fromActualAmount, setFromActualAmount] = useState('');
  const [fromAmountError, setFromAmountError] = useState('');
  const [fromTokenError, setFromTokenError] = useState('');
  const [receiveTokenError, setReceiveTokenError] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('');
  const [receiveActualAmount, setReceiveActualAmount] = useState('');
  const [receiveAmountError, setReceiveAmountError] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [addonsRiskChecked, setAddonsRiskChecked] = useState(false);
  const [addonsRequireIdentity, setAddonsRequireIdentity] = useState(false);
  const { state: approveState, send: approveSend, resetState: approveResetState } = useApprove(swapContract);
  const {
    state: createSwapState,
    send: createSwapSend,
    resetState: createSwapResetState
  } = useCreateSwap(swapContract);
  const {
    state: executeSwapState,
    send: executeSwapSend,
    resetState: executeSwapResetState
  } = useExecuteSwap(swapContract);
  const {
    state: cancelSwapState,
    send: cancelSwapSend,
    resetState: cancelSwapResetState
  } = useCancelSwap(swapContract);
  const {
    state: changeExecutorState,
    send: changeExecutorSend,
    resetState: changeExecutorResetState
  } = useChangeExecutor(swapContract);
  // const isLocked = useGetSingleValue('isLocked', [account], ID_CONTRACT, idContract);

  const chainName = DEFAULT_SUPPORTED_CHAINS.find((network) => network.chainId === chainId)?.chainName;

  const fromTokenInfo = useToken(fromToken);
  const receiveTokenInfo = useToken(receiveToken);
  const fromTokenBalance = useTokenBalance(fromToken, account);

  useEffect(() => {
    if (approveState) {
      console.log(approveState);
      if (approveState.status === 'PendingSignature') {
        setLoading(true);
      }
      if (approveState.status === 'Exception') {
        setLoading(false);
      }
      if (approveState.status === 'None') {
        setLoading(false);
      }
      if (approveState.status === 'Mining') {
        setLoading(true);
      }
      if (approveState.status === 'Success') {
        setLoading(false);
      }
    }
  }, [approveState]);

  useEffect(() => {
    if (createSwapState) {
      console.log(createSwapState);
      if (createSwapState.status === 'PendingSignature') {
        setLoading(true);
      }
      if (createSwapState.status === 'Exception') {
        setLoading(false);
      }
      if (createSwapState.status === 'None') {
        setLoading(false);
      }
      if (createSwapState.status === 'Mining') {
        setLoading(true);
      }
      if (createSwapState.status === 'Success') {
        setLoading(false);
      }
    }
  }, [createSwapState]);

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
  }, [activateBrowserWallet]);

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

  const onSubmitCreateSwap = (e) => {
    e.preventDefault();

    // if needs approval

    // call approve

    // otherwise call the swap

    createSwapResetState();
    createSwapSend(
      fromToken,
      fromActualAmount.toString(),
      receiveToken,
      receiveActualAmount.toString(),
      executor,
      addonsRequireIdentity
    );
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
              <Stack spacing={2} alignItems="center">
                <img src="logo-full.png" width="100%" alt="Veriswap Logo" />
                <Alert severity="warning">Connect your wallet to start using Veriswap!</Alert>
                <Alert severity="error">
                  <AlertTitle>App Under Development</AlertTitle>
                  This app is currently under active development and may not work properly. Use at your own peril.
                </Alert>
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
            )}
            {account && (
              <form noValidate autoComplete="off" onSubmit={onSubmitCreateSwap}>
                <Stack spacing={2} alignItems="center">
                  <img src="/logo-full.png" width="200" alt="Veriswap Logo" />
                  <TextField
                    sx={{ height: 54 }}
                    label="Token to Send"
                    variant="outlined"
                    color="primary"
                    size="medium"
                    disabled={isLoading}
                    fullWidth
                    value={fromToken}
                    onChange={handleChangeFromToken}
                    error={fromTokenError !== ''}
                    helperText={fromTokenError}
                  />
                  <TextField
                    sx={{ height: 54 }}
                    label="Amount to Send"
                    variant="outlined"
                    color="primary"
                    size="medium"
                    disabled={isLoading}
                    fullWidth
                    value={fromAmount}
                    onChange={handleChangeFromAmount}
                    error={fromAmountError !== ''}
                    helperText={fromAmountError}
                  />
                  <ButtonGroup variant="contained" color="secondary" fullWidth size="small">
                    <Button onClick={(e) => handleClickFromPercentage(e, 25)}>25%</Button>
                    <Button onClick={(e) => handleClickFromPercentage(e, 50)}>50%</Button>
                    <Button onClick={(e) => handleClickFromPercentage(e, 75)}>75%</Button>
                    <Button onClick={(e) => handleClickFromPercentage(e, 100)}>100%</Button>
                  </ButtonGroup>
                  {fromTokenInfo && fromTokenBalance && (
                    <Chip
                      label={`Balance: ${formatEther(fromTokenBalance, fromTokenInfo.decimals)} ${
                        fromTokenInfo.symbol
                      }`}
                      sx={{ fontFamily: 'Roboto Mono' }}
                    />
                  )}
                  <TextField
                    sx={{ height: 54 }}
                    label="Token to Receive"
                    variant="outlined"
                    color="primary"
                    size="medium"
                    disabled={isLoading}
                    fullWidth
                    value={receiveToken}
                    onChange={handleChangeReceiveToken}
                    error={receiveTokenError !== ''}
                    helperText={receiveTokenError}
                  />
                  <TextField
                    sx={{ height: 54 }}
                    label="Amount to Receive"
                    variant="outlined"
                    color="primary"
                    size="medium"
                    fullWidth
                    disabled={isLoading}
                    value={receiveAmount}
                    onChange={handleChangeReceiveAmount}
                    error={receiveAmountError !== ''}
                    helperText={receiveAmountError}
                  />
                  {receiveTokenInfo && (
                    <Chip
                      label={`Receiving: ${receiveAmount} ${receiveTokenInfo.symbol}`}
                      sx={{ fontFamily: 'Roboto Mono' }}
                    />
                  )}
                  <TextField
                    sx={{ height: 54 }}
                    label="Executor"
                    variant="outlined"
                    color="primary"
                    size="medium"
                    disabled={isLoading}
                    fullWidth
                    value={executor}
                    onChange={handleChangeExecutor}
                  />
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={addonsRiskChecked}
                          disabled
                          // disabled={!account}
                          // onChange={handleChangeAddonsRiskChecked}
                        />
                      }
                      label="Enforce Risk Detection"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={addonsRequireIdentity}
                          disabled={!account}
                          onChange={handleChangeAddonsRequireIdentity}
                        />
                      }
                      label="Require Signata Identity"
                    />
                  </FormGroup>
                  {/* {addonsRequireIdentity && isLocked && (
                    <Alert>
                      <AlertTitle>{isLocked}</AlertTitle>
                    </Alert>
                  )} */}
                  <ButtonGroup fullWidth size="medium" orientation="vertical">
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      disabled={isLoading}
                      style={{ fontWeight: 900 }}
                      fullWidth
                      type="submit"
                      endIcon={<DoneIcon />}
                    >
                      APPROVE
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={isLoading}
                      size="large"
                      style={{ fontWeight: 900 }}
                      fullWidth
                      type="submit"
                      endIcon={<SwapHorizIcon />}
                    >
                      OPEN SWAP
                    </Button>
                  </ButtonGroup>

                  <ApprovalStatus state={approveState} />
                  <CreateSwapStatus state={createSwapState} />

                  <Divider />
                  <Typography variant="body2" sx={{ fontFamily: 'Roboto Mono', paddingTop: 2 }}>
                    {`Connected Wallet: ${shortenAddress(account)}`}
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'Roboto Mono' }}>
                    {`Network: ${chainName}`}
                  </Typography>
                </Stack>
              </form>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Swap;
