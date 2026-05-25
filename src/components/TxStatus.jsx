import { Alert, AlertTitle, CircularProgress, Stack, Link } from '@mui/material';
import { useAccount } from 'wagmi';

const explorerTx = (chain, hash) => {
  if (!chain || !hash) return null;
  const base = chain.blockExplorers?.default?.url;
  return base ? `${base}/tx/${hash}` : null;
};

export default function TxStatus({ label, isPending, isConfirming, isSuccess, error, hash }) {
  const { chain } = useAccount();
  if (!isPending && !isConfirming && !isSuccess && !error) return null;

  if (error) {
    return (
      <Alert severity="error">
        <AlertTitle>{label} failed</AlertTitle>
        {error.shortMessage || error.message}
      </Alert>
    );
  }
  if (isPending) {
    return (
      <Alert severity="info" icon={<CircularProgress size={18} />}>
        <AlertTitle>Confirm {label.toLowerCase()} in your wallet</AlertTitle>
      </Alert>
    );
  }
  if (isConfirming) {
    const url = explorerTx(chain, hash);
    return (
      <Alert severity="info" icon={<CircularProgress size={18} />}>
        <AlertTitle>{label} pending on-chain…</AlertTitle>
        {url && (
          <Link href={url} target="_blank" rel="noopener">View transaction</Link>
        )}
      </Alert>
    );
  }
  if (isSuccess) {
    const url = explorerTx(chain, hash);
    return (
      <Alert severity="success">
        <AlertTitle>{label} confirmed</AlertTitle>
        {url && <Link href={url} target="_blank" rel="noopener">View transaction</Link>}
      </Alert>
    );
  }
  return null;
}
