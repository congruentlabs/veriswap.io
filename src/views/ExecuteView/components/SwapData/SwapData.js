/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { useTokenBalance, useToken, useTokenAllowance } from '@usedapp/core';
import { formatEther } from '@ethersproject/units';

import { Box, Divider, Chip, Typography } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { getSwapContract } from 'hooks';

const SwapData = (props) => {
  const {
    swapData,
    chainId,
    account,
    setRequiresApproval,
    isAllowedToExecute,
    setIsAllowedToExecute,
    isCreator,
    setIsCreator,
    setSwapAllowance
  } = props;

  const swapContract = getSwapContract(chainId);
  const inputTokenInfo = useToken(swapData.inputToken);
  const outputTokenInfo = useToken(swapData.outputToken);
  const outputTokenBalance = useTokenBalance(swapData.outputToken, account);
  const swapAllowance = useTokenAllowance(swapData.outputToken, account, swapContract);

  useEffect(() => {
    if (swapData && account) {
      if (swapData.creator === account) {
        setIsCreator(true);
      }
      if (swapData.executor === account) {
        setIsAllowedToExecute(true);
      }
    }
  }, [account, swapData, setIsCreator, setIsAllowedToExecute]);

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
      <Typography component="p" variant="body1" align="left" color="text.secondary">
        Swap Creator
      </Typography>
      {swapData.executor && (
        <Typography component="p" variant="body2" align="left">
          {swapData.creator}
        </Typography>
      )}
      <Typography component="p" variant="body1" align="left" color="text.secondary">
        Allowed Executor
      </Typography>
      {swapData.executor && (
        <Typography component="p" variant="body2" align="left">
          {swapData.executor}
        </Typography>
      )}
      <Divider sx={{ margin: 2 }}>
        {isAllowedToExecute ? (
          <Chip
            sx={{ borderRadius: 2 }}
            label="You're allowed to execute this swap"
            color="success"
            icon={<DoneIcon />}
          />
        ) : (
          <Chip
            sx={{ borderRadius: 2 }}
            label="You're not allowed to execute this swap"
            color="warning"
            icon={<WarningAmberIcon />}
          />
        )}
      </Divider>
      <Typography component="p" variant="body2" align="left" color="text.secondary">
        Token you're sending
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
      <Typography component="p" variant="body2" align="left" color="text.secondary">
        Amount you're sending
      </Typography>
      {swapData.outputAmount && outputTokenInfo && (
        <Typography component="p" variant="h4" align="left">
          {`${formatEther(swapData.outputAmount || 0, outputTokenInfo.decimals)} ${outputTokenInfo.symbol}`}
        </Typography>
      )}
      <Typography component="p" variant="body2" align="left" color="text.secondary">
        Your balance
      </Typography>
      {outputTokenBalance && outputTokenInfo && (
        <Typography component="p" variant="h4" align="left">
          {`${formatEther(outputTokenBalance || 0, outputTokenInfo.decimals)} ${outputTokenInfo.symbol}`}
        </Typography>
      )}
      <Divider sx={{ margin: 2 }} />
      <Typography component="p" variant="body2" align="left" color="text.secondary">
        Token you're receiving
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
      <Typography component="p" variant="body2" align="left" color="text.secondary">
        Amount you're receiving
      </Typography>
      {inputTokenInfo && (
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
