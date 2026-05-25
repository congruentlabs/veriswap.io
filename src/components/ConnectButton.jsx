import { Button, Menu, MenuItem, Stack, Tooltip } from '@mui/material';
import { useState } from 'react';
import { useAccount, useChainId, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { SUPPORTED_CHAINS, isChainSupported } from '../consts.js';

const shorten = (addr) => `${addr.slice(0, 6)}…${addr.slice(-4)}`;

export default function ConnectButton({ size = 'medium' }) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { connect, connectors, isPending: connecting, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, chains } = useSwitchChain();

  const [chainAnchor, setChainAnchor] = useState(null);
  const [acctAnchor, setAcctAnchor] = useState(null);

  const injected = connectors.find((c) => c.type === 'injected') || connectors[0];
  const hasProvider = typeof window !== 'undefined' && !!window.ethereum;

  if (!isConnected) {
    if (!hasProvider) {
      return (
        <Tooltip title="Install MetaMask or another browser wallet to continue">
          <span>
            <Button
              variant="contained"
              size={size}
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener"
            >
              Install wallet
            </Button>
          </span>
        </Tooltip>
      );
    }
    return (
      <Button
        variant="contained"
        size={size}
        disabled={connecting || !injected}
        onClick={() => connect({ connector: injected })}
      >
        {connecting ? 'Connecting…' : 'Connect wallet'}
      </Button>
    );
  }

  const currentChain = chains.find((c) => c.id === chainId);
  const chainLabel = currentChain?.name || `Chain ${chainId}`;
  const chainOk = isChainSupported(chainId);

  return (
    <Stack direction="row" spacing={1}>
      <Button
        size={size}
        variant="outlined"
        color={chainOk ? 'primary' : 'warning'}
        onClick={(e) => setChainAnchor(e.currentTarget)}
      >
        {chainOk ? chainLabel : 'Wrong network'}
      </Button>
      <Menu open={Boolean(chainAnchor)} anchorEl={chainAnchor} onClose={() => setChainAnchor(null)}>
        {SUPPORTED_CHAINS.map((c) => (
          <MenuItem
            key={c.id}
            selected={c.id === chainId}
            onClick={() => {
              switchChain({ chainId: c.id });
              setChainAnchor(null);
            }}
          >
            {c.name}
          </MenuItem>
        ))}
      </Menu>

      <Button size={size} variant="contained" onClick={(e) => setAcctAnchor(e.currentTarget)}>
        {shorten(address)}
      </Button>
      <Menu open={Boolean(acctAnchor)} anchorEl={acctAnchor} onClose={() => setAcctAnchor(null)}>
        <MenuItem
          onClick={() => {
            navigator.clipboard?.writeText(address);
            setAcctAnchor(null);
          }}
        >
          Copy address
        </MenuItem>
        <MenuItem
          onClick={() => {
            disconnect();
            setAcctAnchor(null);
          }}
        >
          Disconnect
        </MenuItem>
      </Menu>

      {connectError && null}
    </Stack>
  );
}
