/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { useTokenBalance, useToken, useTokenAllowance, useEtherBalance } from '@usedapp/core';
import { formatUnits } from '@ethersproject/units';

import { Box, Divider, Chip, Typography } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { getNativeToken, getSwapContractAddress, isNativeToken, isNativeSwap } from 'hooks';

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
    setSwapAllowance,
    isComplete
  } = props;

  // const swapContract = getSwapContract(chainId);
  const nativeSwap = Boolean(isNativeSwap(swapData.inputToken, swapData.outputToken));
  const swapContract = getSwapContractAddress(chainId, nativeSwap);
  const isInputNative = isNativeToken(swapData.inputToken);
  const isOutputNative = isNativeToken(swapData.outputToken);
  const nativeTokenInfo = getNativeToken(chainId);
  const inputErc20TokenInfo = useToken(isInputNative ? undefined : swapData.inputToken);
  const outputErc20TokenInfo = useToken(isOutputNative ? undefined : swapData.outputToken);
  const outputNativeBalance = useEtherBalance(account);
  const outputErc20TokenBalance = useTokenBalance(isOutputNative ? undefined : swapData.outputToken, account);
  const inputTokenInfo = isInputNative ? nativeTokenInfo : inputErc20TokenInfo;
  const outputTokenInfo = isOutputNative ? nativeTokenInfo : outputErc20TokenInfo;
  const outputTokenBalance = isOutputNative ? outputNativeBalance : outputErc20TokenBalance;
  const swapAllowance = useTokenAllowance(
    isOutputNative || !swapContract ? undefined : swapData.outputToken,
    account,
    swapContract || undefined
  );

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
    if (isOutputNative || isComplete) {
      setRequiresApproval(false);
    } else if (!swapAllowance || swapAllowance.lt(swapData.outputAmount)) {
      setRequiresApproval(true);
    } else {
      setRequiresApproval(false);
    }
  }, [setSwapAllowance, swapAllowance, setRequiresApproval, outputTokenBalance, swapData, isOutputNative, isComplete]);

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
      {!isComplete ? (
        <Divider sx={{ margin: 2 }}>
          {isAllowedToExecute ? (
            <Chip
              sx={{ borderRadius: 2 }}
              label="You're the designated executor of this swap"
              color="success"
              icon={<DoneIcon />}
            />
          ) : (
            <Chip
              sx={{ borderRadius: 2 }}
              label="You're not the designated executor of this swap"
              color="warning"
              icon={<WarningAmberIcon />}
            />
          )}
        </Divider>
      ) : (
        <Divider sx={{ margin: 2 }} />
      )}
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
          {`${formatUnits(swapData.outputAmount || 0, outputTokenInfo.decimals)} ${outputTokenInfo.symbol}`}
        </Typography>
      )}
      <Typography component="p" variant="body2" align="left" color="text.secondary">
        Your balance
      </Typography>
      {outputTokenBalance && outputTokenInfo && (
        <Typography component="p" variant="body1" align="left">
          {`${formatUnits(outputTokenBalance || 0, outputTokenInfo.decimals)} ${outputTokenInfo.symbol}`}
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
          {`${formatUnits(swapData.inputAmount || 0, inputTokenInfo.decimals)} ${inputTokenInfo.symbol}`}
        </Typography>
      )}
      {!isComplete && <Divider sx={{ margin: 2 }} />}
      {!isComplete && (
        <Typography component={'p'} variant="body2" align="left">
          If you agree to this exchange, approve and complete the swap!
        </Typography>
      )}
    </Box>
  );
};

export default SwapData;
