/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useTokenBalance, useEthers, useToken, useTokenAllowance } from '@usedapp/core';
import { Contract } from '@ethersproject/contracts';
import axios from 'axios';
import { formatEther, formatUnits, parseUnits } from '@ethersproject/units';
import { Stack, TextField, Typography, Button, Link } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import {
  useApprove,
  logLoading,
  shouldBeLoading,
  getUsdcWrapContractAddress,
  getUsdcWrapContract,
  getUsdcTokenAddress,
  useDepositUsdc,
  useWithdrawUsdc
} from 'hooks';
import ApprovalStatus from 'components/ApprovalStatus';
import StatusMessage from 'components/StatusMessage';

import ERC20_ABI from 'erc20Abi.json';

const VUSDC = () => {
  const { account, chainId } = useEthers();
  const wrapContract = getUsdcWrapContract(chainId);
  const wrapContractAddress = getUsdcWrapContractAddress(chainId);
  const usdtTokenAddress = getUsdcTokenAddress(chainId);
  const usdtToken = new Contract(usdtTokenAddress || '0x0000000000000000000000000000000000000000', ERC20_ABI);
  const [usdtAmount, setUsdcAmount] = useState('');
  const [usdtActualAmount, setUsdcActualAmount] = useState('');
  const [vUsdcAmount, setVUsdcAmount] = useState('');
  const [vUsdcActualAmount, setVUsdcActualAmount] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [requiresApproval, setRequiresApproval] = useState(false);
  const { state: depositState, send: depositSend, resetState: depositResetState } = useDepositUsdc(wrapContract);
  const { state: withdrawState, send: withdrawSend, resetState: withdrawResetState } = useWithdrawUsdc(wrapContract);
  const { state: approveState, send: approveSend, resetState: approveResetState } = useApprove(usdtToken);

  const usdtTokenInfo = useToken(usdtTokenAddress);
  const vUsdcTokenInfo = useToken(wrapContractAddress);
  const usdtTokenBalance = useTokenBalance(usdtTokenAddress, account);
  const vUsdcTokenBalance = useTokenBalance(wrapContractAddress, account);
  const wrapAllowance = useTokenAllowance(usdtTokenAddress, account, wrapContractAddress);

  useEffect(() => {
    if (wrapAllowance < usdtActualAmount) {
      setRequiresApproval(true);
    } else {
      setRequiresApproval(false);
    }
  }, [wrapAllowance, setRequiresApproval, usdtActualAmount]);

  useEffect(() => {
    if (approveState) {
      logLoading(approveState, 'approve');
      setLoading(shouldBeLoading(approveState.status));
    }
  }, [approveState]);

  useEffect(() => {
    if (usdtTokenBalance && usdtTokenInfo && !usdtAmount) {
      setUsdcActualAmount(usdtTokenBalance);
      setUsdcAmount(formatEther(usdtTokenBalance, usdtTokenInfo.decimals));
    }
  }, [usdtTokenBalance, usdtTokenInfo, usdtAmount]);

  useEffect(() => {
    if (vUsdcTokenBalance && vUsdcTokenInfo && !vUsdcAmount) {
      setVUsdcActualAmount(vUsdcTokenBalance);
      setVUsdcAmount(formatEther(vUsdcTokenBalance, vUsdcTokenInfo.decimals));
    }
  }, [vUsdcTokenBalance, vUsdcTokenInfo, vUsdcAmount]);

  const onSubmitWrap = (e) => {
    e.preventDefault();
    approveResetState();
    depositResetState();
    withdrawResetState();

    if (requiresApproval) {
      approveSend(wrapContractAddress, usdtActualAmount);
    } else {
      depositSend(usdtActualAmount);
    }
  };

  const onSubmitUnwrap = (e) => {
    e.preventDefault();
    approveResetState();
    depositResetState();
    withdrawResetState();

    withdrawSend(vUsdcActualAmount);
  };

  const onChangeUsdcAmount = (e) => {
    try {
      const newAmount = e.target.value;
      const parsedAmount = parseUnits(newAmount, usdtTokenInfo.decimals);
      if (parsedAmount.gt(usdtTokenBalance) || parsedAmount.isNegative()) {
        setUsdcAmount(formatUnits(usdtTokenBalance || 0, usdtTokenInfo.decimals));
        setUsdcActualAmount(usdtTokenBalance);
      } else {
        setUsdcAmount(newAmount);
        setUsdcActualAmount(parseUnits(newAmount, usdtTokenInfo.decimals));
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const onChangeVUsdcAmount = (e) => {
    try {
      const newAmount = e.target.value;
      const parsedAmount = parseUnits(newAmount, vUsdcTokenInfo.decimals);
      if (parsedAmount.gt(vUsdcTokenBalance) || parsedAmount.isNegative()) {
        setVUsdcAmount(formatUnits(vUsdcTokenBalance || 0, vUsdcTokenInfo.decimals));
        setVUsdcActualAmount(vUsdcTokenBalance);
      } else {
        setVUsdcAmount(newAmount);
        setVUsdcActualAmount(parseUnits(newAmount, vUsdcTokenInfo.decimals));
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Stack spacing={2} alignItems="center">
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        {usdtTokenInfo && usdtTokenInfo.name} Token
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 700 }}>
        Balance: {usdtTokenBalance && formatUnits(usdtTokenBalance || 0, usdtTokenInfo.decimals)}{' '}
        {usdtTokenInfo && usdtTokenInfo.symbol}
      </Typography>
      <TextField
        value={usdtAmount}
        onChange={onChangeUsdcAmount}
        label="Amount"
        variant="outlined"
        type="number"
        fullWidth
      />
      <Button
        color="primary"
        variant="contained"
        fullWidth
        disabled={usdtTokenBalance && usdtTokenBalance.isZero()}
        size="large"
        startIcon={<ArrowDownwardIcon />}
        onClick={onSubmitWrap}
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
        disabled={vUsdcTokenBalance && vUsdcTokenBalance.isZero()}
        size="large"
        startIcon={<ArrowUpwardIcon />}
        onClick={onSubmitUnwrap}
      >
        Unwrap
      </Button>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        {vUsdcTokenInfo && vUsdcTokenInfo.name} Token
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 700 }}>
        Balance: {vUsdcTokenBalance && formatUnits(vUsdcTokenBalance || 0, vUsdcTokenInfo.decimals)}{' '}
        {vUsdcTokenInfo && vUsdcTokenInfo.symbol}
      </Typography>
      <TextField
        value={vUsdcAmount}
        onChange={onChangeVUsdcAmount}
        label="Amount"
        variant="outlined"
        type="number"
        fullWidth
      />
      <StatusMessage state={withdrawState} title="Unwrap Token" />
    </Stack>
  );
};

export default VUSDC;
