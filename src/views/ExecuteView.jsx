import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Alert, AlertTitle, Box, Button, Card, CardContent, Chip, Divider,
  Stack, TextField, Typography
} from '@mui/material';
import { useAccount, useChainId, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { erc20Abi, formatUnits, isAddress, zeroAddress } from 'viem';
import swapAbi from '../swapAbi.json';
import { getSwapAddress, isChainSupported } from '../consts.js';
import { useTokenInfo } from '../hooks/useTokenInfo.js';
import UnsupportedChain from '../components/UnsupportedChain.jsx';
import ConnectGate from '../components/ConnectGate.jsx';
import TxStatus from '../components/TxStatus.jsx';

const STATE_LABELS = { 1: 'Open', 2: 'Executed', 3: 'Cancelled' };

export default function ExecuteView() {
  const { swapId } = useParams();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const swapAddress = getSwapAddress(chainId);
  const supported = isChainSupported(chainId);

  const validSwapId = isAddress(swapId || '');

  const swap = useReadContract({
    address: swapAddress,
    abi: swapAbi,
    functionName: 'swaps',
    args: validSwapId ? [swapId] : undefined,
    query: { enabled: Boolean(swapAddress && validSwapId) }
  });

  const data = swap.data;
  const parsed = useMemo(() => {
    if (!data) return null;
    const [inputToken, inputAmount, outputToken, outputAmount, executor, creator, requireIdentity, requireKyc, requireSanctions, state] = data;
    return { inputToken, inputAmount, outputToken, outputAmount, executor, creator, requireIdentity, requireKyc, requireSanctions, state: Number(state) };
  }, [data]);

  const inputInfo = useTokenInfo(parsed?.inputToken);
  const outputInfo = useTokenInfo(parsed?.outputToken, address, swapAddress);

  const isCreator = address && parsed && address.toLowerCase() === parsed.creator.toLowerCase();
  const isExecutor = address && parsed && address.toLowerCase() === parsed.executor.toLowerCase();

  const needsApproval =
    parsed && typeof outputInfo.allowance === 'bigint' && outputInfo.allowance < parsed.outputAmount;

  const [newExecutor, setNewExecutor] = useState('');

  const approve = useWriteContract();
  const approveReceipt = useWaitForTransactionReceipt({ hash: approve.data });

  const execute = useWriteContract();
  const executeReceipt = useWaitForTransactionReceipt({ hash: execute.data });

  const cancel = useWriteContract();
  const cancelReceipt = useWaitForTransactionReceipt({ hash: cancel.data });

  const changeExec = useWriteContract();
  const changeExecReceipt = useWaitForTransactionReceipt({ hash: changeExec.data });

  useEffect(() => {
    if (approveReceipt.isSuccess) outputInfo.refetch?.();
  }, [approveReceipt.isSuccess, outputInfo]);
  useEffect(() => {
    if (executeReceipt.isSuccess || cancelReceipt.isSuccess || changeExecReceipt.isSuccess) swap.refetch?.();
  }, [executeReceipt.isSuccess, cancelReceipt.isSuccess, changeExecReceipt.isSuccess, swap]);

  if (!isConnected) return <ConnectGate />;
  if (!supported) return <UnsupportedChain />;
  if (!validSwapId) return <Alert severity="error">Invalid swap ID in URL.</Alert>;
  if (!parsed) return <Typography>Loading…</Typography>;
  if (parsed.creator === zeroAddress) {
    return <Alert severity="error"><AlertTitle>Swap not found</AlertTitle>No swap exists for this address.</Alert>;
  }

  const fmt = (info, amount) =>
    info.decimals !== undefined
      ? `${formatUnits(amount, Number(info.decimals))} ${info.symbol || ''}`
      : amount.toString();

  const renderField = (label, value) => (
    <Stack direction="row" justifyContent="space-between" sx={{ py: 0.5 }}>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{value}</Typography>
    </Stack>
  );

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" gutterBottom>Swap details</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip label={STATE_LABELS[parsed.state] || 'Unknown'} color={parsed.state === 1 ? 'primary' : parsed.state === 2 ? 'success' : 'default'} />
          {isCreator && <Chip label="You created this swap" color="secondary" variant="outlined" />}
          {isExecutor && !isCreator && <Chip label="You're the designated executor" color="success" variant="outlined" />}
          {!isCreator && !isExecutor && <Chip label="You're not the executor" color="warning" variant="outlined" />}
        </Stack>
      </Box>

      <Card variant="outlined">
        <CardContent>
          {renderField('Creator', parsed.creator)}
          {renderField('Executor', parsed.executor)}
          <Divider sx={{ my: 1 }} />
          {renderField('Sending', `${fmt(inputInfo, parsed.inputAmount)} (${inputInfo.name || parsed.inputToken})`)}
          {renderField('Receiving', `${fmt(outputInfo, parsed.outputAmount)} (${outputInfo.name || parsed.outputToken})`)}
          <Divider sx={{ my: 1 }} />
          {renderField('Requires Signata identity', parsed.requireIdentity ? 'Yes' : 'No')}
          {renderField('Requires KYC proof', parsed.requireKyc ? 'Yes' : 'No')}
          {renderField('Requires sanctions screening', parsed.requireSanctions ? 'Yes' : 'No')}
          {isExecutor && (
            <>
              <Divider sx={{ my: 1 }} />
              {renderField('Your balance', fmt(outputInfo, outputInfo.balance || 0n))}
            </>
          )}
        </CardContent>
      </Card>

      {parsed.state === 2 && <Alert severity="success">This swap has been executed.</Alert>}
      {parsed.state === 3 && <Alert severity="warning">This swap has been cancelled.</Alert>}

      {parsed.state === 1 && isExecutor && !isCreator && (
        <Stack spacing={2}>
          <TxStatus label="Approval" isPending={approve.isPending} isConfirming={approveReceipt.isLoading} isSuccess={approveReceipt.isSuccess} error={approve.error || approveReceipt.error} hash={approve.data} />
          <TxStatus label="Swap execution" isPending={execute.isPending} isConfirming={executeReceipt.isLoading} isSuccess={executeReceipt.isSuccess} error={execute.error || executeReceipt.error} hash={execute.data} />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              variant="outlined" size="large" fullWidth
              disabled={!needsApproval || approve.isPending || approveReceipt.isLoading}
              onClick={() => approve.writeContract({
                address: parsed.outputToken, abi: erc20Abi, functionName: 'approve',
                args: [swapAddress, parsed.outputAmount]
              })}
            >
              {needsApproval ? `Approve ${outputInfo.symbol || 'token'}` : 'Approved'}
            </Button>
            <Button
              variant="contained" size="large" fullWidth
              disabled={needsApproval || execute.isPending || executeReceipt.isLoading}
              onClick={() => execute.writeContract({
                address: swapAddress, abi: swapAbi, functionName: 'executeSwap',
                args: [parsed.creator]
              })}
            >
              Complete swap
            </Button>
          </Stack>
        </Stack>
      )}

      {parsed.state === 1 && isCreator && (
        <Stack spacing={2}>
          <Typography variant="h6">Manage your swap</Typography>
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={2}>
                <TextField
                  label="New executor address"
                  value={newExecutor}
                  onChange={(e) => setNewExecutor(e.target.value.trim())}
                  helperText="Reassign which address can execute this swap"
                />
                <TxStatus label="Executor change" isPending={changeExec.isPending} isConfirming={changeExecReceipt.isLoading} isSuccess={changeExecReceipt.isSuccess} error={changeExec.error || changeExecReceipt.error} hash={changeExec.data} />
                <Button
                  variant="outlined"
                  disabled={
                    !isAddress(newExecutor) ||
                    newExecutor.toLowerCase() === parsed.executor.toLowerCase() ||
                    newExecutor.toLowerCase() === parsed.creator.toLowerCase() ||
                    changeExec.isPending || changeExecReceipt.isLoading
                  }
                  onClick={() => changeExec.writeContract({
                    address: swapAddress, abi: swapAbi, functionName: 'changeExecutor',
                    args: [newExecutor]
                  })}
                >
                  Change executor
                </Button>
              </Stack>
            </CardContent>
          </Card>

          <TxStatus label="Cancellation" isPending={cancel.isPending} isConfirming={cancelReceipt.isLoading} isSuccess={cancelReceipt.isSuccess} error={cancel.error || cancelReceipt.error} hash={cancel.data} />
          <Button
            variant="outlined" color="error" size="large"
            disabled={cancel.isPending || cancelReceipt.isLoading}
            onClick={() => cancel.writeContract({
              address: swapAddress, abi: swapAbi, functionName: 'cancelSwap'
            })}
          >
            Cancel swap
          </Button>
        </Stack>
      )}
    </Stack>
  );
}
