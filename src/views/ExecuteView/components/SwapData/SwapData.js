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
import WalletLink from 'walletlink';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import { formatEther, formatUnits, parseUnits } from '@ethersproject/units';
import { Contract } from '@ethersproject/contracts';

import { useTheme } from '@mui/material/styles';
import { Alert, AlertTitle, Box, Button, ButtonGroup, Divider, Chip, Typography, Card, Stack } from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import DoneIcon from '@mui/icons-material/Done';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import { useApprove, useGetValue } from '../../../hooks';
import ApprovalStatus from 'components/ApprovalStatus';
import CreateSwapStatus from 'components/CreateSwapStatus';

import SWAP_ABI from '../../../swapAbi.json';
import ID_ABI from '../../../idAbi.json';

const infuraId = 'dab56da72e89492da5a8e77fbc45c7fa';
const SWAP_CONTRACT = '0x2bBB08e5BeCd636b15D8E8de0DCcb98923a2Daad'; // rinkeby
const swapContract = new Contract(SWAP_CONTRACT, SWAP_ABI);
const ID_CONTRACT = '0xb24e28a4b7fed6d59d3bd06af586f02fddfa6385';
const idContract = new Contract(ID_CONTRACT, ID_ABI);

const SwapData = (props) => {
  const { swapData, account, chainId } = props;

  const [fromActualAmount, setFromActualAmount] = useState('');
  const [receiveActualAmount, setReceiveActualAmount] = useState('');
  const [newExecutor, setNewExecutor] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [addonsRequireIdentity, setAddonsRequireIdentity] = useState(false);
  const { state: approveState, send: approveSend, resetState: approveResetState } = useApprove(swapContract);

  const chainName = DEFAULT_SUPPORTED_CHAINS.find((network) => network.chainId === chainId)?.chainName;

  const inputTokenInfo = useToken(swapData.inputToken);
  const outputTokenInfo = useToken(swapData.outputToken);
  const outputTokenBalance = useTokenBalance(swapData.outputToken, account);

  return (
    <Box
      sx={{
        width: '100%',
        padding: 2,
        textAlign: 'center',
        backgroundColor: 'background.paper',
        borderRadius: 2
      }}
    >
      <Typography component="h2" variant="h4" align="left" gutterBottom>
        Swap Details
      </Typography>
      <Typography component="p" variant="body2" align="left">
        Allowed Executor
      </Typography>
      <Typography component="p" variant="subtitle2" align="left">
        {swapData.executor}
      </Typography>
      <Divider sx={{ margin: 2 }}>
        {swapData.executor === account ? (
          <Chip label="You're allowed to execute this swap" color="success" icon={<DoneIcon />} />
        ) : (
          <Chip label="You're not allowed to execute this swap" color="error" icon={<WarningAmberIcon />} />
        )}
      </Divider>
      <Typography component="p" variant="body2" align="left">
        Token you're sending
      </Typography>
      <Typography component="p" variant="h4" align="left">
        {outputTokenInfo.name}
      </Typography>
      <Typography component="p" variant="subtitle2" align="left" sx={{ paddingBottom: 2 }}>
        {swapData.outputToken}
      </Typography>
      <Typography component="p" variant="body2" align="left">
        Amount you're sending
      </Typography>
      <Typography component="p" variant="h4" align="left">
        {`${swapData.outputAmount} ${outputTokenInfo.symbol}`}
      </Typography>
      <Divider sx={{ margin: 2 }} />
      <Typography component="p" variant="body2" align="left">
        Token you're receiving
      </Typography>
      <Typography component="p" variant="h4" align="left">
        {inputTokenInfo.name}
      </Typography>
      <Typography component="p" variant="subtitle2" align="left" sx={{ paddingBottom: 2 }}>
        {fromToken}
      </Typography>
      <Typography component="p" variant="body2" align="left">
        Amount you're receiving
      </Typography>
      <Typography component="p" variant="h4" align="left" sx={{ paddingBottom: 2 }}>
        {`${formatEther(fromTokenBalance, inputTokenInfo.decimals)} ${inputTokenInfo.symbol}`}
      </Typography>
      <Typography component={'p'} variant="body2" align="left">
        If you agree to this token swap, approve and complete the swap!
      </Typography>
    </Box>
  );
};

export default SwapData;
