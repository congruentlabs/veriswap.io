import { createConfig, http } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { SUPPORTED_CHAINS } from './consts.js';

const transports = Object.fromEntries(SUPPORTED_CHAINS.map((c) => [c.id, http()]));

export const wagmiConfig = createConfig({
  chains: SUPPORTED_CHAINS,
  connectors: [injected({ shimDisconnect: true })],
  transports,
  ssr: false
});
