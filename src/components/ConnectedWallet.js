import React from 'react';
import { useEthers, shortenAddress, DEFAULT_SUPPORTED_CHAINS, useLookupAddress } from '@usedapp/core';
import { Typography, Box } from '@mui/material';

const ConnectedWallet = (props) => {
  const { account } = props;
  const { chainId } = useEthers();
  const ens = useLookupAddress(account);

  const chainName = DEFAULT_SUPPORTED_CHAINS.find((network) => network.chainId === chainId)?.chainName;

  return (
    <Box
      sx={{
        width: '100%',
        padding: 2,
        textAlign: 'center',
        borderRadius: 0
      }}
    >
      <Typography component="p" variant="caption" color="text.secondary">
        Connected Wallet
      </Typography>
      <Typography component="p" variant="body1">
        {ens ? ens : shortenAddress(account)}
      </Typography>
      <Typography component="p" variant="body2" color="text.secondary">
        {chainName}
      </Typography>
    </Box>
  );
};

export default ConnectedWallet;
