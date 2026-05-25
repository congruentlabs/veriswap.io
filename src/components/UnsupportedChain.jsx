import { Alert, AlertTitle } from '@mui/material';
import { SUPPORTED_CHAINS } from '../consts.js';

export default function UnsupportedChain() {
  return (
    <Alert severity="warning">
      <AlertTitle>Unsupported network</AlertTitle>
      Switch your wallet to one of: {SUPPORTED_CHAINS.map((c) => c.name).join(', ')}.
    </Alert>
  );
}
