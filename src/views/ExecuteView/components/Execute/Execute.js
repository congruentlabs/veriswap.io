/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
  useEtherBalance,
  useTokenBalance,
  useEthers,
  shortenAddress,
  useToken,
  shortenIfAddress,
  useTokenAllowance,
  DEFAULT_SUPPORTED_CHAINS
} from '@usedapp/core';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import WalletLink from 'walletlink';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import { formatEther, formatUnits, parseUnits } from '@ethersproject/units';
import { Contract } from '@ethersproject/contracts';

import { useTheme } from '@mui/material/styles';
import { Alert, AlertTitle, Box, Button, ButtonGroup, Divider, Chip, Typography, Card, Stack } from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import DoneIcon from '@mui/icons-material/Done';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import Container from 'components/Container';
import { useExecuteSwap, useCancelSwap, useChangeExecutor, useApprove, useGetValue } from '../../../hooks';
import ApprovalStatus from 'components/ApprovalStatus';
import CreateSwapStatus from 'components/CreateSwapStatus';
import SwapData from '../SwapData';

import SWAP_ABI from '../../../swapAbi.json';
import ID_ABI from '../../../idAbi.json';
import { BigNumber } from 'ethers';

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

const Execute = (props) => {
  const theme = useTheme();
  const { swapId } = props;

  const { activateBrowserWallet, activate, account, chainId } = useEthers();

  const [allowedToExecute, setAllowedToExecute] = useState(false);
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [swapAllowance, setSwapAllowance] = useState('');
  const [newExecutor, setNewExecutor] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [addonsRequireIdentity, setAddonsRequireIdentity] = useState(false);
  const { state: approveState, send: approveSend, resetState: approveResetState } = useApprove(swapContract);

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

  const [parsedSwapData, setParsedSwapData] = useState({});

  const swapData = useGetValue('swaps', [swapId], SWAP_CONTRACT, swapContract);

  const chainName = DEFAULT_SUPPORTED_CHAINS.find((network) => network.chainId === chainId)?.chainName;

  const fromTokenInfo = useToken(parsedSwapData.inputToken || '');
  const receiveTokenInfo = useToken(parsedSwapData.outputToken || '');

  useEffect(() => {
    if (swapData && swapData.creator) {
      // const parsedData = {
      //   inputToken: swapData.creator,
      //   inputAmount: swapData.inputAmount,
      //   outputToken: swapData.outputToken,
      //   outputAmount: swapData.outputAmount,
      //   executor: swapData.executor,
      //   creator: swapData.creator,
      //   requireIdentity: swapData.requireIdentity,
      //   state: swapData.state
      // };
      const parsedData = {
        inputToken: '0xdA3083e219FB1012BB8CA5fE4eF42f83299b973c',
        inputAmount: BigNumber.from('20000000000000000000'),
        outputToken: '0xee479918Eb7fEfC0C7D4578B28c53b5f8620B977',
        outputAmount: BigNumber.from('40000000000000000000'),
        executor: '0xc441601696DF5ce0922224248AD96AB956D3B1Ae',
        creator: '0xc441601696DF5ce0922224248AD96AB956D3B1Ae',
        requireIdentity: 0,
        state: 0
      };
      setParsedSwapData(parsedData);
    }
  }, [swapData]);

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
    if (executeSwapState) {
      console.log(executeSwapState);
      if (executeSwapState.status === 'PendingSignature') {
        setLoading(true);
      }
      if (executeSwapState.status === 'Exception') {
        setLoading(false);
      }
      if (executeSwapState.status === 'None') {
        setLoading(false);
      }
      if (executeSwapState.status === 'Mining') {
        setLoading(true);
      }
      if (executeSwapState.status === 'Success') {
        setLoading(false);
      }
    }
  }, [executeSwapState]);

  useEffect(() => {
    if (cancelSwapState) {
      console.log(cancelSwapState);
      if (cancelSwapState.status === 'PendingSignature') {
        setLoading(true);
      }
      if (cancelSwapState.status === 'Exception') {
        setLoading(false);
      }
      if (cancelSwapState.status === 'None') {
        setLoading(false);
      }
      if (cancelSwapState.status === 'Mining') {
        setLoading(true);
      }
      if (cancelSwapState.status === 'Success') {
        setLoading(false);
      }
    }
  }, [cancelSwapState]);

  useEffect(() => {
    if (changeExecutorState) {
      console.log(changeExecutorState);
      if (changeExecutorState.status === 'PendingSignature') {
        setLoading(true);
      }
      if (changeExecutorState.status === 'Exception') {
        setLoading(false);
      }
      if (changeExecutorState.status === 'None') {
        setLoading(false);
      }
      if (changeExecutorState.status === 'Mining') {
        setLoading(true);
      }
      if (changeExecutorState.status === 'Success') {
        setLoading(false);
      }
    }
  }, [changeExecutorState]);

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
      setNewExecutor(e.target.value);
    } catch {
      // do nothing
    }
  };

  const handleChangeAddonsRequireIdentity = () => {
    setAddonsRequireIdentity(!addonsRequireIdentity);
  };

  const onSubmitExecuteSwap = () => {
    executeSwapResetState();
    executeSwapSend(creatorAddress);
  };

  const onSubmitCancelSwap = () => {
    cancelSwapResetState();
    cancelSwapSend();
  };

  const onSubmitChangeExecutorSwap = () => {
    changeExecutorResetState();
    changeExecutorSend(newExecutor);
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
            )}
            {account &&
              parsedSwapData.creator &&
              parsedSwapData.creator === '0x0000000000000000000000000000000000000000' && (
                <Stack spacing={2} alignItems="center">
                  <img src="/logo-full.png" width="200" alt="Veriswap Logo" />
                  <Alert severity="warning" sx={{ width: '100%' }}>
                    <AlertTitle>Invalid Swap URL</AlertTitle>
                    Please check that the URL of your swap is correct.
                  </Alert>
                </Stack>
              )}
            {account && parsedSwapData.executor && receiveTokenInfo && fromTokenInfo && (
              <form noValidate autoComplete="off" onSubmit={onSubmitExecuteSwap}>
                <Stack spacing={2} alignItems="center">
                  <img src="/logo.png" width="150" alt="Veriswap Logo" />
                  <SwapData
                    swapData={parsedSwapData}
                    account={account}
                    chainId={chainId}
                    allowedToExecute={allowedToExecute}
                    setAllowedToExecute={setAllowedToExecute}
                    setSwapAllowance={setSwapAllowance}
                    requiresApproval={requiresApproval}
                    setRequiresApproval={setRequiresApproval}
                  />

                  <ButtonGroup fullWidth size="medium" orientation="vertical">
                    <Button
                      variant="contained"
                      color="secondary"
                      size="large"
                      disabled={isLoading || !allowedToExecute || !requiresApproval}
                      style={{ fontWeight: 900 }}
                      fullWidth
                      type="submit"
                      endIcon={<DoneIcon />}
                    >
                      APPROVE
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      disabled={isLoading || !allowedToExecute || requiresApproval}
                      size="large"
                      style={{ fontWeight: 900 }}
                      fullWidth
                      type="submit"
                      endIcon={<SwapHorizIcon />}
                    >
                      COMPLETE SWAP
                    </Button>
                  </ButtonGroup>

                  <ApprovalStatus state={approveState} />
                  {/* <CreateSwapStatus state={createSwapState} /> */}

                  <Box
                    sx={{
                      width: '100%',
                      padding: 2,
                      textAlign: 'center',
                      backgroundColor: 'background.level2',
                      borderRadius: 2
                    }}
                  >
                    <Typography component="p" variant="body2" align="left">
                      Connected Wallet
                    </Typography>
                    <Typography component="p" variant="h6" align="left">
                      {shortenAddress(account)}
                    </Typography>
                    <Typography component="p" variant="body2" align="left">
                      Network
                    </Typography>
                    <Typography component="p" variant="h6" align="left">
                      {chainName}
                    </Typography>
                  </Box>
                </Stack>
              </form>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Execute;
