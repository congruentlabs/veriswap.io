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
  getUsdtWrapContractAddress,
  getUsdtWrapContract,
  getUsdtTokenAddress,
  useDepositUsdt,
  useWithdrawUsdt
} from 'hooks';
import ApprovalStatus from 'components/ApprovalStatus';
import StatusMessage from 'components/StatusMessage';

import ERC20_ABI from 'erc20Abi.json';

const VUSDT = () => {
  const { account, chainId } = useEthers();
  const wrapContract = getUsdtWrapContract(chainId);
  const wrapContractAddress = getUsdtWrapContractAddress(chainId);
  const usdtTokenAddress = getUsdtTokenAddress(chainId);
  const usdtToken = new Contract(usdtTokenAddress || '0x0000000000000000000000000000000000000000', ERC20_ABI);
  const [usdtAmount, setUsdtAmount] = useState('');
  const [usdtActualAmount, setUsdtActualAmount] = useState('');
  const [vUsdtAmount, setVUsdtAmount] = useState('');
  const [vUsdtActualAmount, setVUsdtActualAmount] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [requiresApproval, setRequiresApproval] = useState(false);
  const { state: depositState, send: depositSend, resetState: depositResetState } = useDepositUsdt(wrapContract);
  const { state: withdrawState, send: withdrawSend, resetState: withdrawResetState } = useWithdrawUsdt(wrapContract);
  const { state: approveState, send: approveSend, resetState: approveResetState } = useApprove(usdtToken);

  const usdtTokenInfo = useToken(usdtTokenAddress);
  const vUsdtTokenInfo = useToken(wrapContractAddress);
  const usdtTokenBalance = useTokenBalance(usdtTokenAddress, account);
  const vUsdtTokenBalance = useTokenBalance(wrapContractAddress, account);
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
      setUsdtActualAmount(usdtTokenBalance);
      setUsdtAmount(formatEther(usdtTokenBalance, usdtTokenInfo.decimals));
    }
  }, [usdtTokenBalance, usdtTokenInfo, usdtAmount]);

  useEffect(() => {
    if (vUsdtTokenBalance && vUsdtTokenInfo && !vUsdtAmount) {
      setVUsdtActualAmount(vUsdtTokenBalance);
      setVUsdtAmount(formatEther(vUsdtTokenBalance, vUsdtTokenInfo.decimals));
    }
  }, [vUsdtTokenBalance, vUsdtTokenInfo, vUsdtAmount]);

  const onSubmitWrapSata = (e) => {
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

  const onSubmitUnwrapSata = (e) => {
    e.preventDefault();
    approveResetState();
    depositResetState();
    withdrawResetState();

    withdrawSend(vUsdtActualAmount);
  };

  const onChangeUsdtAmount = (e) => {
    try {
      const newAmount = e.target.value;
      const parsedAmount = parseUnits(newAmount, usdtTokenInfo.decimals);
      if (parsedAmount.gt(usdtTokenBalance) || parsedAmount.isNegative()) {
        setUsdtAmount(formatUnits(usdtTokenBalance || 0, usdtTokenInfo.decimals));
        setUsdtActualAmount(usdtTokenBalance);
      } else {
        setUsdtAmount(newAmount);
        setUsdtActualAmount(parseUnits(newAmount, usdtTokenInfo.decimals));
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const onChangeVUsdtAmount = (e) => {
    try {
      const newAmount = e.target.value;
      const parsedAmount = parseUnits(newAmount, vUsdtTokenInfo.decimals);
      if (parsedAmount.gt(vUsdtTokenBalance) || parsedAmount.isNegative()) {
        setVUsdtAmount(formatUnits(vUsdtTokenBalance || 0, vUsdtTokenInfo.decimals));
        setVUsdtActualAmount(vUsdtTokenBalance);
      } else {
        setVUsdtAmount(newAmount);
        setVUsdtActualAmount(parseUnits(newAmount, vUsdtTokenInfo.decimals));
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
        onChange={onChangeUsdtAmount}
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
        disabled={vUsdtTokenBalance && vUsdtTokenBalance.isZero()}
        size="large"
        startIcon={<ArrowUpwardIcon />}
        onClick={onSubmitUnwrapSata}
      >
        Unwrap
      </Button>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        {vUsdtTokenInfo && vUsdtTokenInfo.name} Token
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 700 }}>
        Balance: {vUsdtTokenBalance && formatUnits(vUsdtTokenBalance || 0, vUsdtTokenInfo.decimals)}{' '}
        {vUsdtTokenInfo && vUsdtTokenInfo.symbol}
      </Typography>
      <TextField
        value={vUsdtAmount}
        onChange={onChangeVUsdtAmount}
        label="Amount"
        variant="outlined"
        type="number"
        fullWidth
      />
      <StatusMessage state={withdrawState} title="Unwrap Token" />
    </Stack>
  );
};

export default VUSDT;
