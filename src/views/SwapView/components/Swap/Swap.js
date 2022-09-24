/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useTokenBalance, useEthers, useToken, shortenIfAddress, useTokenAllowance } from '@usedapp/core';
import { Contract } from '@ethersproject/contracts';
import axios from 'axios';
// import Torus from '@toruslabs/torus-embed';
import { formatEther, formatUnits, parseUnits } from '@ethersproject/units';
import { useTheme } from '@mui/material/styles';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  ButtonGroup,
  Card,
  Chip,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Switch,
  TextField,
  Autocomplete
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import DoneIcon from '@mui/icons-material/Done';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import {
  useCreateSwap,
  useApprove,
  getSwapContractAddress,
  getSwapContract,
  useGetValue,
  logLoading,
  shouldBeLoading,
  getTokenList
} from 'hooks';
import Container from 'components/Container';
import ApprovalStatus from 'components/ApprovalStatus';
import CreateSwapStatus from 'components/CreateSwapStatus';
import AccountConnector from 'components/AccountConnector';
import ConnectedWallet from 'components/ConnectedWallet';
import UnsupportedChain from 'components/UnsupportedChain';

import { SUPPORTED_CHAINS, SANCTIONS_SUPPORTED_CHAINS } from 'consts';

import ERC20_ABI from 'erc20Abi.json';

const Swap = () => {
  const theme = useTheme();
  const { account, chainId } = useEthers();
  const swapContract = getSwapContract(chainId);
  const swapContractAddress = getSwapContractAddress(chainId);
  const tokenListAddress = getTokenList(chainId);
  const [tokens, setTokens] = useState([]);
  const [fromToken, setFromToken] = useState('');
  const [receiveToken, setReceiveToken] = useState('');
  const [executor, setExecutor] = useState('');
  // const [fromToken, setFromToken] = useState('0xdA3083e219FB1012BB8CA5fE4eF42f83299b973c');
  // const [receiveToken, setReceiveToken] = useState('0xee479918Eb7fEfC0C7D4578B28c53b5f8620B977');
  // const [executor, setExecutor] = useState('0xce95DAde44E7307bAA616C77EF446915633dD9Ab');
  const [fromAmount, setFromAmount] = useState('');
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
  const [addonsRequireKyc, setAddonsRequireKyc] = useState(false);
  const [addonsRequireOfacSanctions, setAddonsRequireOfacSanctions] = useState(false);
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [swapAlreadyOpen, setSwapAlreadyOpen] = useState(false);
  const [supportedChain, setSupportedChain] = useState(false);
  const [supportedSanctionChain, setSupportedSanctionChain] = useState(false);
  const {
    state: createSwapState,
    send: createSwapSend,
    resetState: createSwapResetState
  } = useCreateSwap(swapContract);
  const fromTokenContractObj = new Contract(fromToken || '0x0000000000000000000000000000000000000000', ERC20_ABI);
  const { state: approveState, send: approveSend, resetState: approveResetState } = useApprove(fromTokenContractObj);

  // TODO: check if identity locked for the require identity option
  // const isLocked = useGetSingleValue('isLocked', [account], ID_CONTRACT, idContract);

  const fromTokenInfo = useToken(fromToken);
  const receiveTokenInfo = useToken(receiveToken);
  const fromTokenBalance = useTokenBalance(fromToken, account);
  const swapAllowance = useTokenAllowance(fromToken, account, swapContractAddress);
  const swapData = useGetValue('swaps', [account], getSwapContractAddress(chainId), swapContract);

  useEffect(() => {
    const getTokens = async () => {
      const response = await axios.get(tokenListAddress);
      if (response.data && response.data.tokens) {
        setTokens(response.data.tokens);
      }
    };
    if (tokenListAddress) {
      getTokens();
    }
  }, [tokenListAddress]);

  useEffect(() => {
    const chainName = SUPPORTED_CHAINS.find((network) => network.chainId === chainId)?.chainName;
    if (chainName) {
      setSupportedChain(true);
    } else {
      setSupportedChain(false);
    }
  }, [chainId]);

  useEffect(() => {
    const chainName = SANCTIONS_SUPPORTED_CHAINS.find((network) => network.chainId === chainId)?.chainName;
    if (chainName) {
      setSupportedSanctionChain(true);
    } else {
      setSupportedSanctionChain(false);
    }
  }, [chainId]);

  useEffect(() => {
    if (swapData && swapData.state === 1) {
      // 1 === OPEN
      setSwapAlreadyOpen(true);
    }
  }, [swapData]);

  useEffect(() => {
    if (swapAllowance < fromActualAmount) {
      setRequiresApproval(true);
    } else {
      setRequiresApproval(false);
    }
  }, [swapAllowance, setRequiresApproval, fromActualAmount]);

  useEffect(() => {
    if (approveState) {
      logLoading(approveState, 'approve');
      setLoading(shouldBeLoading(approveState.status));
    }
  }, [approveState]);

  useEffect(() => {
    if (createSwapState) {
      logLoading(createSwapState, 'createSwap');
      setLoading(shouldBeLoading(createSwapState.status));
    }
  }, [createSwapState]);

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

  const handleChangeAddonsRequireKyc = () => {
    setAddonsRequireKyc(!addonsRequireKyc);
  };

  const handleChangeAddonsRequireOfacSanctions = () => {
    setAddonsRequireOfacSanctions(!addonsRequireOfacSanctions);
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
    approveResetState();
    createSwapResetState();

    if (requiresApproval) {
      approveSend(swapContractAddress, fromActualAmount);
    } else {
      createSwapSend(
        fromToken, // _inputToken
        fromActualAmount, // _inputAmount
        receiveToken, // _outputToken
        receiveActualAmount, // _outputAmount
        executor, // _executor
        addonsRequireIdentity, // _requireIdentity
        addonsRequireKyc, // _requireKyc
        addonsRequireOfacSanctions // _requireSanctionCheck
      );
    }
  };

  const handleSelectFromToken = (e) => {
    console.log(e.target.value);
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
            {account && !supportedChain && <UnsupportedChain SUPPORTED_CHAINS={SUPPORTED_CHAINS} />}
            {account && supportedChain && (
              <form noValidate autoComplete="off" onSubmit={onSubmitCreateSwap}>
                <Stack spacing={2} alignItems="center">
                  <img src="/logo-full.png" width="200" alt="Veriswap Logo" />
                  {swapAlreadyOpen && (
                    <>
                      <Alert severity="success" sx={{ width: '100%' }}>
                        <AlertTitle>You have an open swap!</AlertTitle>
                        You have a swap already open. You cannot create a new swap unless you cancel your current one or
                        it is executed.
                      </Alert>
                      <Button
                        size="large"
                        sx={{ fontWeight: 900 }}
                        fullWidth
                        color="primary"
                        variant="contained"
                        href={`/#/swap/${account}`}
                      >
                        MANAGE YOUR SWAP
                      </Button>
                    </>
                  )}
                  <Autocomplete
                    id="from-select"
                    sx={{ width: 300 }}
                    options={tokens}
                    autoHighlight
                    onChange={(e) => handleSelectFromToken(e)}
                    getOptionLabel={(option) => option.name}
                    renderOption={(props, option) => (
                      <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                        <img loading="lazy" width="20" src={option.logoURI} srcSet={option.logoURI} alt={option.name} />
                        {option.name} ({option.symbol})
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        label="Select Token"
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: 'new-password' // disable autocomplete and autofill
                        }}
                      />
                    )}
                  />
                  <FormControl fullWidth sx={{ height: 54 }}>
                    <InputLabel htmlFor="from-token">From Token</InputLabel>
                    <OutlinedInput
                      label="Token to Send"
                      variant="outlined"
                      color="primary"
                      placeholder="e.g. 0x3ebb4A4e91Ad83BE51F8d596533818b246F4bEe1"
                      size="medium"
                      disabled={isLoading || swapAlreadyOpen}
                      fullWidth
                      value={fromToken}
                      onChange={handleChangeFromToken}
                      error={fromTokenError !== ''}
                      helperText={fromTokenError ? fromTokenError : 'Paste a valid ERC20 token address.'}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="help"
                            href="https://docs.signata.net/guides/veriswap"
                            target="_blank"
                            // size="small"
                          >
                            <HelpOutlineOutlinedIcon />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                  {fromToken && (
                    <TextField
                      sx={{ height: 54 }}
                      label="Amount to Send"
                      variant="outlined"
                      color="primary"
                      size="medium"
                      disabled={isLoading || swapAlreadyOpen}
                      fullWidth
                      value={fromAmount}
                      onChange={handleChangeFromAmount}
                      error={fromAmountError !== ''}
                      helperText={fromAmountError}
                    />
                  )}
                  {fromToken && (
                    <ButtonGroup
                      disabled={isLoading || swapAlreadyOpen}
                      variant="contained"
                      color="secondary"
                      fullWidth
                      size="small"
                    >
                      <Button onClick={(e) => handleClickFromPercentage(e, 25)}>25%</Button>
                      <Button onClick={(e) => handleClickFromPercentage(e, 50)}>50%</Button>
                      <Button onClick={(e) => handleClickFromPercentage(e, 75)}>75%</Button>
                      <Button onClick={(e) => handleClickFromPercentage(e, 100)}>100%</Button>
                    </ButtonGroup>
                  )}
                  {fromTokenInfo && fromTokenBalance && (
                    <Chip
                      label={`Balance: ${formatEther(fromTokenBalance, fromTokenInfo.decimals)} ${
                        fromTokenInfo.symbol
                      }`}
                      sx={{ fontFamily: 'Roboto Mono', borderRadius: 1, width: '100%', textAlign: 'left' }}
                    />
                  )}
                  {fromToken && (
                    <TextField
                      sx={{ height: 54 }}
                      label="Token to Receive"
                      placeholder="e.g. 0x49428f057dd9d20a8e4c6873e98afd8cd7146e3b"
                      variant="outlined"
                      color="primary"
                      size="medium"
                      disabled={isLoading || swapAlreadyOpen}
                      fullWidth
                      value={receiveToken}
                      onChange={handleChangeReceiveToken}
                      error={receiveTokenError !== ''}
                      helperText={receiveTokenError}
                    />
                  )}
                  {receiveToken && (
                    <TextField
                      sx={{ height: 54 }}
                      label="Amount to Receive"
                      variant="outlined"
                      color="primary"
                      size="medium"
                      fullWidth
                      disabled={isLoading || swapAlreadyOpen}
                      value={receiveAmount}
                      onChange={handleChangeReceiveAmount}
                      error={receiveAmountError !== ''}
                      helperText={receiveAmountError}
                    />
                  )}
                  {receiveTokenInfo && (
                    <Chip
                      label={`Receiving: ${receiveAmount || 0} ${receiveTokenInfo.symbol}`}
                      sx={{ fontFamily: 'Roboto Mono', borderRadius: 1, width: '100%' }}
                    />
                  )}
                  {receiveToken && (
                    <TextField
                      sx={{ height: 54 }}
                      label="Executor"
                      placeholder="e.g. 0x042fc4ea3f836e1ea5dc4fb70ec90ded51c09eca"
                      variant="outlined"
                      color="primary"
                      size="medium"
                      disabled={isLoading || swapAlreadyOpen}
                      fullWidth
                      value={executor}
                      onChange={handleChangeExecutor}
                    />
                  )}
                  {executor && (
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
                            disabled={!account || swapAlreadyOpen}
                            onChange={handleChangeAddonsRequireIdentity}
                          />
                        }
                        label="Require Signata Identity"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={addonsRequireKyc}
                            disabled={!account || swapAlreadyOpen}
                            onChange={handleChangeAddonsRequireKyc}
                          />
                        }
                        label="Require Signata KYC Proof NFT"
                      />
                      {supportedSanctionChain && (
                        <FormControlLabel
                          control={
                            <Switch
                              checked={addonsRequireOfacSanctions}
                              disabled={!account || swapAlreadyOpen}
                              onChange={handleChangeAddonsRequireOfacSanctions}
                            />
                          }
                          label="Require OFAC Sanctions Screening"
                        />
                      )}
                    </FormGroup>
                  )}
                  {/* {addonsRequireIdentity && isLocked && (
                    <Alert>
                      <AlertTitle>{isLocked}</AlertTitle>
                    </Alert>
                  )} */}
                  {executor && (
                    <ButtonGroup fullWidth size="medium" orientation="vertical">
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        disabled={isLoading || !requiresApproval || swapAlreadyOpen}
                        fullWidth
                        type="submit"
                        endIcon={<DoneIcon />}
                      >
                        APPROVE
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={
                          isLoading || requiresApproval || swapAlreadyOpen || !fromActualAmount || !receiveActualAmount
                        }
                        size="large"
                        fullWidth
                        type="submit"
                        endIcon={<SwapHorizIcon />}
                      >
                        OPEN SWAP
                      </Button>
                    </ButtonGroup>
                  )}
                  <ApprovalStatus state={approveState} />
                  <CreateSwapStatus state={createSwapState} />
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
