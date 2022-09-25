/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useEthers, shortenIfAddress, useTokenAllowance } from '@usedapp/core';
import { Contract } from '@ethersproject/contracts';

import { useTheme } from '@mui/material/styles';
import { Alert, AlertTitle, Box, Button, ButtonGroup, Card, Stack, TextField } from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import DoneIcon from '@mui/icons-material/Done';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';

import {
  useExecuteSwap,
  useCancelSwap,
  useChangeExecutor,
  useApprove,
  useGetValue,
  getSwapContractAddress,
  getIdContractAddress,
  logLoading,
  shouldBeLoading
} from 'hooks';
import Container from 'components/Container';
import ApprovalStatus from 'components/ApprovalStatus';
import ExecuteSwapStatus from 'components/ExecuteSwapStatus';
import ChangeExecutorStatus from 'components/ChangeExecutorStatus';
import CancelSwapStatus from 'components/CancelSwapStatus';
import AccountConnector from 'components/AccountConnector';
import ConnectedWallet from 'components/ConnectedWallet';
import InvalidSwap from 'components/InvalidSwap';
import SwapData from '../SwapData';

import SWAP_ABI from 'swapAbi.json';
import ID_ABI from 'idAbi.json';
import ERC20_ABI from 'erc20Abi.json';

const Execute = (props) => {
  const theme = useTheme();
  const { swapId } = props;

  const { account, chainId } = useEthers();
  const swapContract = new Contract(getSwapContractAddress(chainId), SWAP_ABI);
  const idContract = new Contract(getIdContractAddress(chainId), ID_ABI);

  const swapContractAddress = getSwapContractAddress(chainId);
  const [isCreator, setIsCreator] = useState(false);
  const [isAllowedToExecute, setIsAllowedToExecute] = useState(false);
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [swapAllowance, setSwapAllowance] = useState('');
  const [newExecutor, setNewExecutor] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const swapData = useGetValue('swaps', [swapId], getSwapContractAddress(chainId), swapContract);
  const toTokenContractObj = new Contract(
    parsedSwapData.outputToken || '0x0000000000000000000000000000000000000000',
    ERC20_ABI
  );
  const { state: approveState, send: approveSend, resetState: approveResetState } = useApprove(toTokenContractObj);

  useEffect(() => {
    if (swapData && swapData.creator) {
      setParsedSwapData({ ...swapData });
    }
  }, [swapData, setParsedSwapData]);

  useEffect(() => {
    if (approveState) {
      logLoading(approveState, 'approveSwap');
      setLoading(shouldBeLoading(approveState.status));
    }
  }, [approveState]);

  useEffect(() => {
    if (executeSwapState) {
      logLoading(executeSwapState, 'executeSwap');
      setLoading(shouldBeLoading(executeSwapState.status));
    }
  }, [executeSwapState]);

  useEffect(() => {
    if (cancelSwapState) {
      logLoading(cancelSwapState, 'cancelSwap');
      setLoading(shouldBeLoading(cancelSwapState.status));
    }
  }, [cancelSwapState]);

  useEffect(() => {
    if (changeExecutorState) {
      logLoading(changeExecutorState, 'changeExecutor');
      setLoading(shouldBeLoading(changeExecutorState.status));
    }
  }, [changeExecutorState]);

  // const { t } = useTranslation();
  // const isMd = useMediaQuery(theme.breakpoints.up('md'), {
  //   defaultMatches: true,
  // });

  const handleChangeExecutor = (e) => {
    try {
      shortenIfAddress(e.target.value);
      setNewExecutor(e.target.value);
      setError('');
    } catch {
      // do nothing
    }
  };

  const resetStates = () => {
    changeExecutorResetState();
    executeSwapResetState();
    cancelSwapResetState();
    approveResetState();
  };

  const onSubmitExecuteSwap = (e) => {
    e.preventDefault();
    resetStates();
    if (requiresApproval) {
      approveSend(swapContractAddress, parsedSwapData.outputAmount);
    } else {
      executeSwapSend(parsedSwapData.creator);
    }
  };

  const onSubmitCancelSwap = (e) => {
    e.preventDefault();
    resetStates();
    cancelSwapSend();
  };

  const onSubmitChangeExecutorSwap = (e) => {
    e.preventDefault();
    resetStates();
    setError('');
    if (newExecutor === parsedSwapData.executor) {
      setError('New executor is already the current executor!');
    } else if (newExecutor === parsedSwapData.creator) {
      setError('Cannot set the new executor to the swap creator!');
    } else {
      changeExecutorSend(newExecutor);
    }
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
            padding={{ xs: 2, sm: 6 }}
            width={1}
            component={Card}
            borderRadius={2}
            boxShadow="rgb(100 221 23 / 60%) 0px 0px 31.25rem 1rem"
            // data-aos={'zoom-in'}
          >
            {!account && <AccountConnector />}
            {account &&
              parsedSwapData.creator &&
              parsedSwapData.creator === '0x0000000000000000000000000000000000000000' && <InvalidSwap />}
            {account && parsedSwapData && parsedSwapData.state === 3 && (
              <Stack spacing={2} alignItems="center">
                <Alert severity="warning" sx={{ width: '100%' }}>
                  <AlertTitle>Swap Cancelled</AlertTitle>
                  This swap has been cancelled.
                </Alert>
                <SwapData
                  swapData={parsedSwapData}
                  account={account}
                  chainId={chainId}
                  isCreator={isCreator}
                  setIsCreator={setIsCreator}
                  isAllowedToExecute={isAllowedToExecute}
                  setIsAllowedToExecute={setIsAllowedToExecute}
                  setSwapAllowance={setSwapAllowance}
                  requiresApproval={requiresApproval}
                  setRequiresApproval={setRequiresApproval}
                  isComplete
                />
              </Stack>
            )}
            {account && parsedSwapData && parsedSwapData.state === 2 && (
              <Stack spacing={2} alignItems="center">
                <Alert severity="success" sx={{ width: '100%' }}>
                  <AlertTitle>Swap Completed</AlertTitle>
                  This swap has been executed successfully.
                </Alert>
                <SwapData
                  swapData={parsedSwapData}
                  account={account}
                  chainId={chainId}
                  isCreator={isCreator}
                  setIsCreator={setIsCreator}
                  isAllowedToExecute={isAllowedToExecute}
                  setIsAllowedToExecute={setIsAllowedToExecute}
                  setSwapAllowance={setSwapAllowance}
                  requiresApproval={requiresApproval}
                  setRequiresApproval={setRequiresApproval}
                  isComplete
                />
              </Stack>
            )}
            {account &&
              parsedSwapData &&
              parsedSwapData.executor &&
              parsedSwapData.inputToken &&
              parsedSwapData.state === 1 && (
                <form noValidate autoComplete="off" onSubmit={onSubmitExecuteSwap}>
                  <Stack spacing={2} alignItems="center">
                    <img src="/logo.png" width="150" alt="Veriswap Logo" />
                    {isCreator && (
                      <Alert severity="success">
                        <AlertTitle>This is your swap</AlertTitle>
                        You cannot execute your own swap, but you can change the executor or cancel it.
                      </Alert>
                    )}
                    <ConnectedWallet account={account} />
                    <SwapData
                      swapData={parsedSwapData}
                      account={account}
                      chainId={chainId}
                      isCreator={isCreator}
                      setIsCreator={setIsCreator}
                      isAllowedToExecute={isAllowedToExecute}
                      setIsAllowedToExecute={setIsAllowedToExecute}
                      setSwapAllowance={setSwapAllowance}
                      requiresApproval={requiresApproval}
                      setRequiresApproval={setRequiresApproval}
                    />

                    {isCreator && (
                      <Alert severity="info">
                        <AlertTitle>Changing Executor</AlertTitle>
                        To change the executor of your swap, provide the new executor address below.
                      </Alert>
                    )}

                    {isCreator && (
                      <TextField
                        sx={{ height: 54 }}
                        label="New Executor"
                        variant="outlined"
                        color="primary"
                        size="medium"
                        disabled={isLoading}
                        fullWidth
                        value={newExecutor}
                        onChange={handleChangeExecutor}
                      />
                    )}

                    {isCreator && (
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        disabled={isLoading}
                        onClick={onSubmitChangeExecutorSwap}
                        style={{ fontWeight: 700 }}
                        fullWidth
                        endIcon={<ChangeCircleOutlinedIcon />}
                      >
                        CHANGE EXECUTOR
                      </Button>
                    )}

                    {isCreator && (
                      <Button
                        variant="contained"
                        color="secondary"
                        disabled={isLoading}
                        size="large"
                        style={{ fontWeight: 700 }}
                        onClick={onSubmitCancelSwap}
                        fullWidth
                        endIcon={<CancelOutlinedIcon />}
                      >
                        CANCEL SWAP
                      </Button>
                    )}

                    {isAllowedToExecute && (
                      <ButtonGroup fullWidth size="medium" orientation="vertical">
                        <Button
                          variant="contained"
                          color="secondary"
                          size="large"
                          disabled={isLoading || !requiresApproval}
                          style={{ fontWeight: 700 }}
                          fullWidth
                          type="submit"
                          endIcon={<DoneIcon />}
                        >
                          APPROVE
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          disabled={isLoading || requiresApproval}
                          size="large"
                          style={{ fontWeight: 700 }}
                          fullWidth
                          type="submit"
                          endIcon={<SwapHorizIcon />}
                        >
                          COMPLETE SWAP
                        </Button>
                      </ButtonGroup>
                    )}

                    <ApprovalStatus state={approveState} />
                    <ExecuteSwapStatus state={executeSwapState} />
                    <ChangeExecutorStatus state={changeExecutorState} />
                    <CancelSwapStatus state={cancelSwapState} />

                    {error && (
                      <Alert severity="error" sx={{ width: '100%' }}>
                        <AlertTitle>Error</AlertTitle>
                        {error}
                      </Alert>
                    )}
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
