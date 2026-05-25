import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { SUPPORTED_CHAINS } from './consts.js';

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'YOUR_WALLETCONNECT_PROJECT_ID';

export const wagmiConfig = getDefaultConfig({
  appName: 'Veriswap',
  projectId,
  chains: SUPPORTED_CHAINS,
  ssr: false
});
