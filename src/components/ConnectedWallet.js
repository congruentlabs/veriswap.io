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
        backgroundColor: 'background.level2',
        borderRadius: 2
      }}
    >
      <Typography component="p" variant="body2" align="left" color="text.secondary">
        Connected Wallet
      </Typography>
      <Typography component="p" variant="body1" align="left">
        {shortenAddress(account)}
      </Typography>
      {ens && (
        <Typography component="p" variant="body1" align="left" color="text.secondary" gutterBottom>
          {ens}
        </Typography>
      )}
      <Typography component="p" variant="body2" align="left" color="text.secondary">
        Network
      </Typography>
      <Typography component="p" variant="body1" align="left">
        {chainName}
      </Typography>
    </Box>
  );
};

export default ConnectedWallet;
