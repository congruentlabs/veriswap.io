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
  getDaiWrapContractAddress,
  getDaiWrapContract,
  getDaiTokenAddress,
  useDepositDai,
  useWithdrawDai
} from 'hooks';
import ApprovalStatus from 'components/ApprovalStatus';
import StatusMessage from 'components/StatusMessage';

import ERC20_ABI from 'erc20Abi.json';

const VDAI = () => {
  const { account, chainId } = useEthers();
  const wrapContract = getDaiWrapContract(chainId);
  const wrapContractAddress = getDaiWrapContractAddress(chainId);
  const daiTokenAddress = getDaiTokenAddress(chainId);
  const daiToken = new Contract(daiTokenAddress || '0x0000000000000000000000000000000000000000', ERC20_ABI);
  const [daiAmount, setDaiAmount] = useState('');
  const [daiActualAmount, setDaiActualAmount] = useState('');
  const [vDaiAmount, setVDaiAmount] = useState('');
  const [vDaiActualAmount, setVDaiActualAmount] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [requiresApproval, setRequiresApproval] = useState(false);
  const { state: depositState, send: depositSend, resetState: depositResetState } = useDepositDai(wrapContract);
  const { state: withdrawState, send: withdrawSend, resetState: withdrawResetState } = useWithdrawDai(wrapContract);
  const { state: approveState, send: approveSend, resetState: approveResetState } = useApprove(daiToken);

  const daiTokenInfo = useToken(daiTokenAddress);
  const vDaiTokenInfo = useToken(wrapContractAddress);
  const daiTokenBalance = useTokenBalance(daiTokenAddress, account);
  const vDaiTokenBalance = useTokenBalance(wrapContractAddress, account);
  const wrapAllowance = useTokenAllowance(daiTokenAddress, account, wrapContractAddress);

  useEffect(() => {
    if (wrapAllowance < daiActualAmount) {
      setRequiresApproval(true);
    } else {
      setRequiresApproval(false);
    }
  }, [wrapAllowance, setRequiresApproval, daiActualAmount]);

  useEffect(() => {
    if (approveState) {
      logLoading(approveState, 'approve');
      setLoading(shouldBeLoading(approveState.status));
    }
  }, [approveState]);

  useEffect(() => {
    if (daiTokenBalance && daiTokenInfo && !daiAmount) {
      setDaiActualAmount(daiTokenBalance);
      setDaiAmount(formatEther(daiTokenBalance, daiTokenInfo.decimals));
    }
  }, [daiTokenBalance, daiTokenInfo, daiAmount]);

  useEffect(() => {
    if (vDaiTokenBalance && vDaiTokenInfo && !vDaiAmount) {
      setVDaiActualAmount(vDaiTokenBalance);
      setVDaiAmount(formatEther(vDaiTokenBalance, vDaiTokenInfo.decimals));
    }
  }, [vDaiTokenBalance, vDaiTokenInfo, vDaiAmount]);

  const onSubmitWrap = (e) => {
    e.preventDefault();
    approveResetState();
    depositResetState();
    withdrawResetState();

    if (requiresApproval) {
      approveSend(wrapContractAddress, daiActualAmount);
    } else {
      depositSend(daiActualAmount);
    }
  };

  const onSubmitUnwrap = (e) => {
    e.preventDefault();
    approveResetState();
    depositResetState();
    withdrawResetState();

    withdrawSend(vDaiActualAmount);
  };

  const onChangeDaiAmount = (e) => {
    try {
      const newAmount = e.target.value;
      const parsedAmount = parseUnits(newAmount, daiTokenInfo.decimals);
      if (parsedAmount.gt(daiTokenBalance) || parsedAmount.isNegative()) {
        setDaiAmount(formatUnits(daiTokenBalance || 0, daiTokenInfo.decimals));
        setDaiActualAmount(daiTokenBalance);
      } else {
        setDaiAmount(newAmount);
        setDaiActualAmount(parseUnits(newAmount, daiTokenInfo.decimals));
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const onChangeVDaiAmount = (e) => {
    try {
      const newAmount = e.target.value;
      const parsedAmount = parseUnits(newAmount, vDaiTokenInfo.decimals);
      if (parsedAmount.gt(vDaiTokenBalance) || parsedAmount.isNegative()) {
        setVDaiAmount(formatUnits(vDaiTokenBalance || 0, vDaiTokenInfo.decimals));
        setVDaiActualAmount(vDaiTokenBalance);
      } else {
        setVDaiAmount(newAmount);
        setVDaiActualAmount(parseUnits(newAmount, vDaiTokenInfo.decimals));
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Stack spacing={1} alignItems="center">
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        {daiTokenInfo && daiTokenInfo.name} Token
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {daiTokenAddress}
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 700 }}>
        Balance: {daiTokenBalance && formatUnits(daiTokenBalance || 0, daiTokenInfo.decimals)}{' '}
        {daiTokenInfo && daiTokenInfo.symbol}
      </Typography>
      <TextField
        value={daiAmount}
        onChange={onChangeDaiAmount}
        label="Amount"
        variant="outlined"
        type="number"
        fullWidth
      />
      <Button
        color="primary"
        variant="contained"
        fullWidth
        disabled={daiTokenBalance && daiTokenBalance.isZero()}
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
        disabled={vDaiTokenBalance && vDaiTokenBalance.isZero()}
        size="large"
        startIcon={<ArrowUpwardIcon />}
        onClick={onSubmitUnwrap}
      >
        Unwrap
      </Button>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        {vDaiTokenInfo && vDaiTokenInfo.name} Token
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {wrapContractAddress}
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 700 }}>
        Balance: {vDaiTokenBalance && formatUnits(vDaiTokenBalance || 0, vDaiTokenInfo.decimals)}{' '}
        {vDaiTokenInfo && vDaiTokenInfo.symbol}
      </Typography>
      <TextField
        value={vDaiAmount}
        onChange={onChangeVDaiAmount}
        label="Amount"
        variant="outlined"
        type="number"
        fullWidth
      />
      <StatusMessage state={withdrawState} title="Unwrap Token" />
    </Stack>
  );
};

export default VDAI;
