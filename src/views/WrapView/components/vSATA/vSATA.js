/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useTokenBalance, useEthers, useToken, shortenIfAddress, useTokenAllowance } from '@usedapp/core';
import { Contract } from '@ethersproject/contracts';
import axios from 'axios';
// import Torus from '@toruslabs/torus-embed';
import { formatEther, formatUnits, parseUnits } from '@ethersproject/units';
import { useTheme } from '@mui/material/styles';
import { Stack, Autocomplete, Box, Card, TextField, Typography, Button, Link } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import {
  useApprove,
  getSataWrapContractAddress,
  getSataWrapContract,
  logLoading,
  shouldBeLoading,
  getSataTokenAddress,
  useDepositSata,
  useWithdrawSata
} from 'hooks';
import ApprovalStatus from 'components/ApprovalStatus';
import AccountConnector from 'components/AccountConnector';
import StatusMessage from 'components/StatusMessage';

import ERC20_ABI from 'erc20Abi.json';

const VSATA = () => {
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
    <Stack spacing={2} alignItems="center">
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
    </Stack>
  );
};

export default VSATA;
