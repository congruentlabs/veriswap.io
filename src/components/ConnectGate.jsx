import { Paper, Stack, Typography } from '@mui/material';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function ConnectGate({ title = 'Connect a wallet to continue' }) {
  return (
    <Paper sx={{ p: 4, textAlign: 'center' }} variant="outlined">
      <Stack spacing={2} alignItems="center">
        <Typography variant="h6">{title}</Typography>
        <ConnectButton />
      </Stack>
    </Paper>
  );
}
