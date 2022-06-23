import React from 'react';
import { useEthers, shortenAddress, DEFAULT_SUPPORTED_CHAINS } from '@usedapp/core';
import { Typography, Box } from '@mui/material';

const ConnectedWallet = (props) => {
  const { account } = props;
  const { chainId } = useEthers();

  const chainName = DEFAULT_SUPPORTED_CHAINS.find((network) => network.chainId === chainId)?.chainName;

  return (
    <Box
      sx={{
        width: '100%',
        padding: 2,
        textAlign: 'center',
        backgroundColor: 'background.level2',
        borderRadius: 2
      }}
    >
      <Typography component="p" variant="body2" align="left">
        Connected Wallet
      </Typography>
      <Typography component="p" variant="h6" align="left">
        {shortenAddress(account)}
      </Typography>
      <Typography component="p" variant="body2" align="left">
        Network
      </Typography>
      <Typography component="p" variant="h6" align="left">
        {chainName}
      </Typography>
    </Box>
  );
};

export default ConnectedWallet;
