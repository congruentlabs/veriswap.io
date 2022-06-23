/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { useTokenBalance, useToken, useTokenAllowance } from '@usedapp/core';
import { formatEther } from '@ethersproject/units';

import { Box, Divider, Chip, Typography } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
const SWAP_CONTRACT = '0x2bBB08e5BeCd636b15D8E8de0DCcb98923a2Daad'; // rinkeby

const SwapData = (props) => {
  const { swapData, account, setRequiresApproval, allowedToExecute, setAllowedToExecute, setSwapAllowance } = props;

  const inputTokenInfo = useToken(swapData.inputToken);
  const outputTokenInfo = useToken(swapData.outputToken);
  const outputTokenBalance = useTokenBalance(swapData.outputToken, account);
  const swapAllowance = useTokenAllowance(swapData.outputToken, account, SWAP_CONTRACT);

  useEffect(() => {
    if (swapData && account) {
      if (swapData.executor === account) {
        setAllowedToExecute(true);
      }
    }
  }, [account, swapData, setAllowedToExecute]);

  useEffect(() => {
    if (swapAllowance < outputTokenBalance) {
      setRequiresApproval(true);
    } else {
      setRequiresApproval(false);
    }
  }, [setSwapAllowance, swapAllowance, setRequiresApproval, outputTokenBalance]);

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
      <Typography component="p" variant="h6" align="left">
        Swap Creator
      </Typography>
      {swapData.executor && (
        <Typography component="p" variant="body2" align="left">
          {swapData.creator}
        </Typography>
      )}
      <Typography component="p" variant="h6" align="left">
        Allowed Executor
      </Typography>
      {swapData.executor && (
        <Typography component="p" variant="body2" align="left">
          {swapData.executor}
        </Typography>
      )}
      <Divider sx={{ margin: 2 }}>
        {allowedToExecute ? (
          <Chip label="You're allowed to execute this swap" color="success" icon={<DoneIcon />} />
        ) : (
          <Chip label="You're not allowed to execute this swap" color="error" icon={<WarningAmberIcon />} />
        )}
      </Divider>
      <Typography component="p" variant="body2" align="left">
        Token you're <b>sending</b>
      </Typography>
      {outputTokenInfo && (
        <Typography component="p" variant="h4" align="left">
          {outputTokenInfo.name}
        </Typography>
      )}
      {swapData.outputToken && (
        <Typography component="p" variant="body2" align="left" sx={{ paddingBottom: 2 }}>
          {swapData.outputToken}
        </Typography>
      )}
      <Typography component="p" variant="body2" align="left">
        Amount you're sending
      </Typography>
      {swapData.outputAmount && outputTokenInfo && (
        <Typography component="p" variant="h4" align="left">
          {`${formatEther(swapData.outputAmount || 0, outputTokenInfo.decimals)} ${outputTokenInfo.symbol}`}
        </Typography>
      )}
      <Typography component="p" variant="body2" align="left">
        Your balance
      </Typography>
      {outputTokenBalance && outputTokenInfo && (
        <Typography component="p" variant="h4" align="left">
          {`${formatEther(outputTokenBalance || 0, outputTokenInfo.decimals)} ${outputTokenInfo.symbol}`}
        </Typography>
      )}
      <Divider sx={{ margin: 2 }} />
      <Typography component="p" variant="body2" align="left">
        Token you're <b>receiving</b>
      </Typography>
      {inputTokenInfo && (
        <Typography component="p" variant="h4" align="left">
          {inputTokenInfo.name}
        </Typography>
      )}
      {swapData.inputToken && (
        <Typography component="p" variant="body2" align="left" sx={{ paddingBottom: 2 }}>
          {swapData.inputToken}
        </Typography>
      )}
      <Typography component="p" variant="body2" align="left">
        Amount you're receiving
      </Typography>
      {swapData.inputAmount && inputTokenInfo && (
        <Typography component="p" variant="h4" align="left">
          {`${formatEther(swapData.inputAmount || 0, inputTokenInfo.decimals)} ${inputTokenInfo.symbol}`}
        </Typography>
      )}
      <Divider sx={{ margin: 2 }} />
      <Typography component={'p'} variant="body2" align="left">
        If you agree to this exchange, approve and complete the swap!
      </Typography>
    </Box>
  );
};

export default SwapData;
