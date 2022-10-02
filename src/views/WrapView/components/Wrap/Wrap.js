/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useTokenBalance, useEthers, useToken, shortenIfAddress, useTokenAllowance } from '@usedapp/core';
import { Contract } from '@ethersproject/contracts';
import axios from 'axios';
// import Torus from '@toruslabs/torus-embed';
import { formatEther, formatUnits, parseUnits } from '@ethersproject/units';
import { useTheme } from '@mui/material/styles';
import { Stack, Autocomplete, Box, Card, TextField, Typography, Button, Link } from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import DoneIcon from '@mui/icons-material/Done';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import {
  useApprove,
  getSataWrapContractAddress,
  getSataWrapContract,
  logLoading,
  shouldBeLoading,
  getSataTokenAddress,
  getTokenList,
  useDepositSata,
  useWithdrawSata
} from 'hooks';
import Container from 'components/Container';
import ApprovalStatus from 'components/ApprovalStatus';
import CreateSwapStatus from 'components/CreateSwapStatus';
import AccountConnector from 'components/AccountConnector';
import ConnectedWallet from 'components/ConnectedWallet';
import WrapAssetStatus from 'components/WrapAssetStatus';
import StatusMessage from 'components/StatusMessage';

import ERC20_ABI from 'erc20Abi.json';

const Wrap = () => {
  const theme = useTheme();
  const { account, chainId } = useEthers();
  const wrapContract = getSataWrapContract(chainId);
  const wrapContractAddress = getSataWrapContractAddress(chainId);
  const sataTokenAddress = getSataTokenAddress(chainId);
  const sataToken = new Contract(sataTokenAddress || '0x0000000000000000000000000000000000000000', ERC20_ABI);
  const [sataAmount, setSataAmount] = useState('');
  const [sataActualAmount, setSataActualAmount] = useState('');
  const [vSataAmount, setVSataAmount] = useState('');
  const [vSataActualAmount, setVSataActualAmount] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [requiresApproval, setRequiresApproval] = useState(false);
  const { state: depositState, send: depositSend, resetState: depositResetState } = useDepositSata(wrapContract);
  const { state: withdrawState, send: withdrawSend, resetState: withdrawResetState } = useWithdrawSata(wrapContract);
  const { state: approveState, send: approveSend, resetState: approveResetState } = useApprove(sataToken);

  // TODO: check if identity locked for the require identity option
  // const isLocked = useGetSingleValue('isLocked', [account], ID_CONTRACT, idContract);

  const sataTokenInfo = useToken(sataTokenAddress);
  const vSataTokenInfo = useToken(wrapContractAddress);
  const sataTokenBalance = useTokenBalance(sataTokenAddress, account);
  const vSataTokenBalance = useTokenBalance(wrapContractAddress, account);
  const wrapAllowance = useTokenAllowance(sataTokenAddress, account, wrapContractAddress);

  useEffect(() => {
    if (wrapAllowance < sataActualAmount) {
      setRequiresApproval(true);
    } else {
      setRequiresApproval(false);
    }
  }, [wrapAllowance, setRequiresApproval, sataActualAmount]);

  useEffect(() => {
    if (approveState) {
      logLoading(approveState, 'approve');
      setLoading(shouldBeLoading(approveState.status));
    }
  }, [approveState]);

  useEffect(() => {
    if (sataTokenBalance && sataTokenInfo && !sataAmount) {
      setSataActualAmount(sataTokenBalance);
      setSataAmount(formatEther(sataTokenBalance, sataTokenInfo.decimals));
    }
  }, [sataTokenBalance, sataTokenInfo, sataAmount]);

  useEffect(() => {
    if (vSataTokenBalance && vSataTokenInfo && !vSataAmount) {
      setVSataActualAmount(vSataTokenBalance);
      setVSataAmount(formatEther(vSataTokenBalance, vSataTokenInfo.decimals));
    }
  }, [vSataTokenBalance, vSataTokenInfo, vSataAmount]);

  const onSubmitWrapSata = (e) => {
    e.preventDefault();
    approveResetState();
    depositResetState();
    withdrawResetState();

    if (requiresApproval) {
      approveSend(wrapContractAddress, sataActualAmount);
    } else {
      depositSend(sataActualAmount);
    }
  };

  const onSubmitUnwrapSata = (e) => {
    e.preventDefault();
    approveResetState();
    depositResetState();
    withdrawResetState();

    withdrawSend(vSataActualAmount);
  };

  const onChangeSataAmount = (e) => {
    try {
      const newAmount = e.target.value;
      const parsedAmount = parseUnits(newAmount, sataTokenInfo.decimals);
      if (parsedAmount.gt(sataTokenBalance) || parsedAmount.isNegative()) {
        setSataAmount(formatUnits(sataTokenBalance || 0, sataTokenInfo.decimals));
        setSataActualAmount(sataTokenBalance);
      } else {
        setSataAmount(newAmount);
        setSataActualAmount(parseUnits(newAmount, sataTokenInfo.decimals));
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const onChangeVSataAmount = (e) => {
    try {
      const newAmount = e.target.value;
      const parsedAmount = parseUnits(newAmount, vSataTokenInfo.decimals);
      if (parsedAmount.gt(vSataTokenBalance) || parsedAmount.isNegative()) {
        setVSataAmount(formatUnits(vSataTokenBalance || 0, vSataTokenInfo.decimals));
        setVSataActualAmount(vSataTokenBalance);
      } else {
        setVSataAmount(newAmount);
        setVSataActualAmount(parseUnits(newAmount, vSataTokenInfo.decimals));
      }
    } catch (error) {
      console.error(error.message);
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
            {account && (
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
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {sataTokenInfo && sataTokenInfo.name} Token
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                  Balance: {sataTokenBalance && formatUnits(sataTokenBalance || 0, sataTokenInfo.decimals)}{' '}
                  {sataTokenInfo && sataTokenInfo.symbol}
                </Typography>
                <TextField
                  value={sataAmount}
                  onChange={onChangeSataAmount}
                  label="Amount"
                  variant="outlined"
                  type="number"
                  fullWidth
                />
                <Button
                  color="primary"
                  variant="contained"
                  fullWidth
                  disabled={sataTokenBalance && sataTokenBalance.isZero()}
                  size="large"
                  startIcon={<ArrowDownwardIcon />}
                  onClick={onSubmitWrapSata}
                >
                  {requiresApproval ? 'Approve' : 'Wrap'}
                </Button>
                <ApprovalStatus state={approveState} />
                <StatusMessage state={depositState} title="Wrap Token" />
                <Typography variant="body2" align="center">
                  Wrapping and Unwrapping tokens requires a Signata KYC NFT to held by your wallet. You can{' '}
                  <Link href="https://my.signata.net" target="_blank">
                    verify and purchase one from Signata
                  </Link>
                  .
                </Typography>
                <Button
                  color="secondary"
                  variant="contained"
                  fullWidth
                  disabled={vSataTokenBalance && vSataTokenBalance.isZero()}
                  size="large"
                  startIcon={<ArrowUpwardIcon />}
                  onClick={onSubmitUnwrapSata}
                >
                  Unwrap
                </Button>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {vSataTokenInfo && vSataTokenInfo.name} Token
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                  Balance: {vSataTokenBalance && formatUnits(vSataTokenBalance || 0, vSataTokenInfo.decimals)}{' '}
                  {vSataTokenInfo && vSataTokenInfo.symbol}
                </Typography>
                <TextField
                  value={vSataAmount}
                  onChange={onChangeVSataAmount}
                  label="Amount"
                  variant="outlined"
                  type="number"
                  fullWidth
                />
                <StatusMessage state={withdrawState} title="Unwrap Token" />
                <img src="/logo-full.png" width="200" alt="Veriswap Logo" />
              </Stack>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Wrap;
