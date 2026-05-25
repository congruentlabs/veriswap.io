import { useEffect, useMemo, useState } from 'react';
import {
  Autocomplete, Box, Button, Card, CardContent, Checkbox, Chip, Divider,
  FormControlLabel, Stack, TextField, Typography, Alert, ButtonGroup
} from '@mui/material';
import { useAccount, useChainId, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { erc20Abi, formatUnits, isAddress, parseUnits, zeroAddress } from 'viem';
import swapAbi from '../swapAbi.json';
import { getSwapAddress, isChainSupported, isSanctionsSupported } from '../consts.js';
import { useTokenList } from '../hooks/useTokenList.js';
import { useTokenInfo } from '../hooks/useTokenInfo.js';
import UnsupportedChain from '../components/UnsupportedChain.jsx';
import ConnectGate from '../components/ConnectGate.jsx';
import TxStatus from '../components/TxStatus.jsx';

export default function SwapView() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const swapAddress = getSwapAddress(chainId);
  const supported = isChainSupported(chainId);

  const { data: tokens = [], isLoading: loadingTokens } = useTokenList(chainId);

  const [fromToken, setFromToken] = useState(null);
  const [toToken, setToToken] = useState(null);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [executor, setExecutor] = useState('');
  const [requireIdentity, setRequireIdentity] = useState(false);
  const [requireKyc, setRequireKyc] = useState(false);
  const [requireSanctions, setRequireSanctions] = useState(false);

  useEffect(() => {
    setFromToken(null);
    setToToken(null);
  }, [chainId]);

  const fromInfo = useTokenInfo(fromToken?.address, address, swapAddress);
  const fromDecimals = fromInfo.decimals ?? fromToken?.decimals ?? 18;
  const fromAmountWei = useMemo(() => {
    try {
      return fromAmount ? parseUnits(fromAmount, Number(fromDecimals)) : 0n;
    } catch { return 0n; }
  }, [fromAmount, fromDecimals]);

  const toInfo = useTokenInfo(toToken?.address);
  const toDecimals = toInfo.decimals ?? toToken?.decimals ?? 18;
  const toAmountWei = useMemo(() => {
    try {
      return toAmount ? parseUnits(toAmount, Number(toDecimals)) : 0n;
    } catch { return 0n; }
  }, [toAmount, toDecimals]);

  const needsApproval =
    fromAmountWei > 0n &&
    typeof fromInfo.allowance === 'bigint' &&
    fromInfo.allowance < fromAmountWei;

  const existingSwap = useReadContract({
    address: swapAddress,
    abi: swapAbi,
    functionName: 'swaps',
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address && swapAddress) }
  });
  const hasOpenSwap = existingSwap.data && existingSwap.data[9] === 1;

  const approve = useWriteContract();
  const approveReceipt = useWaitForTransactionReceipt({ hash: approve.data });

  const create = useWriteContract();
  const createReceipt = useWaitForTransactionReceipt({ hash: create.data });

  useEffect(() => {
    if (approveReceipt.isSuccess) fromInfo.refetch?.();
  }, [approveReceipt.isSuccess, fromInfo]);

  useEffect(() => {
    if (createReceipt.isSuccess) existingSwap.refetch?.();
  }, [createReceipt.isSuccess, existingSwap]);

  const onApprove = () => {
    approve.writeContract({
      address: fromToken.address,
      abi: erc20Abi,
      functionName: 'approve',
      args: [swapAddress, fromAmountWei]
    });
  };

  const onCreate = () => {
    create.writeContract({
      address: swapAddress,
      abi: swapAbi,
      functionName: 'createSwap',
      args: [
        fromToken.address,
        fromAmountWei,
        toToken.address,
        toAmountWei,
        executor,
        requireIdentity,
        requireKyc,
        requireSanctions
      ]
    });
  };

  const balanceLabel = (info) =>
    info.balance !== undefined && info.decimals !== undefined
      ? `${formatUnits(info.balance, Number(info.decimals))} ${info.symbol || ''}`
      : '—';

  const fromValid = fromToken && isAddress(fromToken.address) && fromAmountWei > 0n;
  const toValid = toToken && isAddress(toToken.address) && toAmountWei > 0n;
  const executorValid = isAddress(executor || '') && executor.toLowerCase() !== (address || '').toLowerCase() && executor !== zeroAddress;
  const allValid = fromValid && toValid && executorValid && !hasOpenSwap;

  if (!isConnected) return <ConnectGate />;
  if (!supported) return <UnsupportedChain />;

  const setPct = (pct) => {
    if (fromInfo.balance === undefined || fromInfo.decimals === undefined) return;
    const amount = (fromInfo.balance * BigInt(pct)) / 100n;
    setFromAmount(formatUnits(amount, Number(fromInfo.decimals)));
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" gutterBottom>Create a swap</Typography>
        <Typography variant="body2" color="text.secondary">
          Define the tokens you want to swap and who can execute it. Optionally gate on Signata identity, KYC, or sanctions screening.
        </Typography>
      </Box>

      {hasOpenSwap && (
        <Alert severity="warning">
          You already have an open swap. Cancel or execute it before creating a new one.
        </Alert>
      )}

      <Card variant="outlined">
        <CardContent>
          <Stack spacing={3}>
            <Stack spacing={1}>
              <Typography variant="overline" color="text.secondary">From</Typography>
              <Autocomplete
                options={tokens}
                loading={loadingTokens}
                value={fromToken}
                onChange={(_, v) => setFromToken(v)}
                getOptionLabel={(o) => (o ? `${o.symbol} — ${o.name}` : '')}
                isOptionEqualToValue={(a, b) => a.address === b.address}
                renderInput={(p) => <TextField {...p} label="Token you're sending" />}
              />
              <TextField
                label="Amount"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                inputMode="decimal"
              />
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip size="small" label={`Balance: ${balanceLabel(fromInfo)}`} />
                <ButtonGroup size="small" variant="outlined">
                  {[25, 50, 75, 100].map((p) => (
                    <Button key={p} onClick={() => setPct(p)}>{p}%</Button>
                  ))}
                </ButtonGroup>
              </Stack>
            </Stack>

            <Divider />

            <Stack spacing={1}>
              <Typography variant="overline" color="text.secondary">To</Typography>
              <Autocomplete
                options={tokens}
                loading={loadingTokens}
                value={toToken}
                onChange={(_, v) => setToToken(v)}
                getOptionLabel={(o) => (o ? `${o.symbol} — ${o.name}` : '')}
                isOptionEqualToValue={(a, b) => a.address === b.address}
                renderInput={(p) => <TextField {...p} label="Token you want" />}
              />
              <TextField
                label="Amount"
                value={toAmount}
                onChange={(e) => setToAmount(e.target.value)}
                inputMode="decimal"
              />
            </Stack>

            <Divider />

            <TextField
              label="Executor address"
              placeholder="0x…"
              value={executor}
              onChange={(e) => setExecutor(e.target.value.trim())}
              error={Boolean(executor) && !executorValid}
              helperText={executor && !executorValid ? 'Must be a valid address that isn’t your own' : 'Only this address can complete the swap'}
            />

            <Stack>
              <FormControlLabel
                control={<Checkbox checked={requireIdentity} onChange={(e) => setRequireIdentity(e.target.checked)} />}
                label="Require a registered Signata identity"
              />
              <FormControlLabel
                control={<Checkbox checked={requireKyc} onChange={(e) => setRequireKyc(e.target.checked)} />}
                label="Require a Signata KYC proof"
              />
              {isSanctionsSupported(chainId) && (
                <FormControlLabel
                  control={<Checkbox checked={requireSanctions} onChange={(e) => setRequireSanctions(e.target.checked)} />}
                  label="Require OFAC sanctions screening"
                />
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <TxStatus
        label="Approval"
        isPending={approve.isPending}
        isConfirming={approveReceipt.isLoading}
        isSuccess={approveReceipt.isSuccess}
        error={approve.error || approveReceipt.error}
        hash={approve.data}
      />
      <TxStatus
        label="Swap creation"
        isPending={create.isPending}
        isConfirming={createReceipt.isLoading}
        isSuccess={createReceipt.isSuccess}
        error={create.error || createReceipt.error}
        hash={create.data}
      />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Button
          variant="outlined"
          size="large"
          disabled={!fromValid || !needsApproval || approve.isPending || approveReceipt.isLoading}
          onClick={onApprove}
          fullWidth
        >
          {needsApproval ? `Approve ${fromInfo.symbol || 'token'}` : 'Approved'}
        </Button>
        <Button
          variant="contained"
          size="large"
          disabled={!allValid || needsApproval || create.isPending || createReceipt.isLoading}
          onClick={onCreate}
          fullWidth
        >
          Create swap
        </Button>
      </Stack>
    </Stack>
  );
}
