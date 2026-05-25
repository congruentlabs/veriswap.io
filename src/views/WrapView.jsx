import { useEffect, useMemo, useState } from 'react';
import {
  Alert, AlertTitle, Box, Button, Card, CardContent, Chip, Divider,
  Stack, Tab, Tabs, TextField, Typography
} from '@mui/material';
import { useAccount, useChainId, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { erc20Abi, formatUnits, parseUnits } from 'viem';
import { WRAPPED_ASSETS_MAINNET } from '../consts.js';
import { useTokenInfo } from '../hooks/useTokenInfo.js';
import ConnectGate from '../components/ConnectGate.jsx';
import TxStatus from '../components/TxStatus.jsx';

const wrapAbi = [
  { name: 'deposit', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'amount', type: 'uint256' }], outputs: [] },
  { name: 'withdraw', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'amount', type: 'uint256' }], outputs: [] }
];

function WrapPanel({ asset }) {
  const { address } = useAccount();
  const underlying = useTokenInfo(asset.underlying, address, asset.wrap);
  const wrapped = useTokenInfo(asset.wrap, address);

  const [wrapAmount, setWrapAmount] = useState('');
  const [unwrapAmount, setUnwrapAmount] = useState('');

  const decimals = Number(underlying.decimals ?? 18);

  const wrapAmountWei = useMemo(() => {
    try { return wrapAmount ? parseUnits(wrapAmount, decimals) : 0n; } catch { return 0n; }
  }, [wrapAmount, decimals]);
  const unwrapAmountWei = useMemo(() => {
    try { return unwrapAmount ? parseUnits(unwrapAmount, decimals) : 0n; } catch { return 0n; }
  }, [unwrapAmount, decimals]);

  const needsApproval = wrapAmountWei > 0n && typeof underlying.allowance === 'bigint' && underlying.allowance < wrapAmountWei;

  const approve = useWriteContract();
  const approveReceipt = useWaitForTransactionReceipt({ hash: approve.data });
  const deposit = useWriteContract();
  const depositReceipt = useWaitForTransactionReceipt({ hash: deposit.data });
  const withdraw = useWriteContract();
  const withdrawReceipt = useWaitForTransactionReceipt({ hash: withdraw.data });

  useEffect(() => {
    if (approveReceipt.isSuccess) underlying.refetch?.();
  }, [approveReceipt.isSuccess, underlying]);
  useEffect(() => {
    if (depositReceipt.isSuccess || withdrawReceipt.isSuccess) {
      underlying.refetch?.();
      wrapped.refetch?.();
    }
  }, [depositReceipt.isSuccess, withdrawReceipt.isSuccess, underlying, wrapped]);

  const fmt = (info) =>
    info.balance !== undefined && info.decimals !== undefined
      ? formatUnits(info.balance, Number(info.decimals))
      : '—';

  return (
    <Stack spacing={3}>
      <Card variant="outlined">
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Wrap {asset.key} → {asset.label}</Typography>
              <Chip size="small" label={`${asset.key} balance: ${fmt(underlying)}`} />
            </Stack>
            <TextField
              label={`Amount of ${asset.key} to wrap`}
              value={wrapAmount}
              onChange={(e) => setWrapAmount(e.target.value)}
              inputMode="decimal"
            />
            <TxStatus label="Approval" isPending={approve.isPending} isConfirming={approveReceipt.isLoading} isSuccess={approveReceipt.isSuccess} error={approve.error || approveReceipt.error} hash={approve.data} />
            <TxStatus label="Wrap" isPending={deposit.isPending} isConfirming={depositReceipt.isLoading} isSuccess={depositReceipt.isSuccess} error={deposit.error || depositReceipt.error} hash={deposit.data} />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                variant="outlined" fullWidth
                disabled={!needsApproval || approve.isPending || approveReceipt.isLoading}
                onClick={() => approve.writeContract({
                  address: asset.underlying, abi: erc20Abi, functionName: 'approve',
                  args: [asset.wrap, wrapAmountWei]
                })}
              >
                {needsApproval ? `Approve ${asset.key}` : 'Approved'}
              </Button>
              <Button
                variant="contained" fullWidth
                disabled={wrapAmountWei === 0n || needsApproval || deposit.isPending || depositReceipt.isLoading}
                onClick={() => deposit.writeContract({
                  address: asset.wrap, abi: wrapAbi, functionName: 'deposit', args: [wrapAmountWei]
                })}
              >
                Wrap
              </Button>
            </Stack>
            <Alert severity="info" variant="outlined">
              Wrapping mints {asset.label} to be held by a KYC-verified Signata identity.
            </Alert>
          </Stack>
        </CardContent>
      </Card>

      <Divider />

      <Card variant="outlined">
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Unwrap {asset.label} → {asset.key}</Typography>
              <Chip size="small" label={`${asset.label} balance: ${fmt(wrapped)}`} />
            </Stack>
            <TextField
              label={`Amount of ${asset.label} to unwrap`}
              value={unwrapAmount}
              onChange={(e) => setUnwrapAmount(e.target.value)}
              inputMode="decimal"
            />
            <TxStatus label="Unwrap" isPending={withdraw.isPending} isConfirming={withdrawReceipt.isLoading} isSuccess={withdrawReceipt.isSuccess} error={withdraw.error || withdrawReceipt.error} hash={withdraw.data} />
            <Button
              variant="contained"
              disabled={unwrapAmountWei === 0n || withdraw.isPending || withdrawReceipt.isLoading}
              onClick={() => withdraw.writeContract({
                address: asset.wrap, abi: wrapAbi, functionName: 'withdraw', args: [unwrapAmountWei]
              })}
            >
              Unwrap
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}

export default function WrapView() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const [tab, setTab] = useState(0);

  if (!isConnected) return <ConnectGate />;
  if (chainId !== mainnet.id) {
    return (
      <Alert severity="warning">
        <AlertTitle>Ethereum mainnet only</AlertTitle>
        Wrapping is only available on Ethereum mainnet. Switch networks in your wallet.
      </Alert>
    );
  }

  const asset = WRAPPED_ASSETS_MAINNET[tab];

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" gutterBottom>Wrap tokens</Typography>
        <Typography variant="body2" color="text.secondary">
          Wrap your tokens into KYC-gated Signata equivalents. Unwrap any time.
        </Typography>
      </Box>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable">
        {WRAPPED_ASSETS_MAINNET.map((a) => (
          <Tab key={a.key} label={a.label} />
        ))}
      </Tabs>
      <WrapPanel key={asset.key} asset={asset} />
    </Stack>
  );
}
