import { useMemo, useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, darkTheme, lightTheme } from '@rainbow-me/rainbowkit';
import { ThemeProvider, CssBaseline } from '@mui/material';
import '@rainbow-me/rainbowkit/styles.css';

import { wagmiConfig } from './wagmi.js';
import { buildTheme } from './theme.js';
import Main from './layouts/Main.jsx';
import SwapView from './views/SwapView.jsx';
import ExecuteView from './views/ExecuteView.jsx';
import WrapView from './views/WrapView.jsx';
import { ColorModeContext } from './colorMode.js';

const queryClient = new QueryClient();

export default function App() {
  const [mode, setMode] = useState(() => localStorage.getItem('themeMode') || 'dark');

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const colorMode = useMemo(
    () => ({ mode, toggle: () => setMode((m) => (m === 'dark' ? 'light' : 'dark')) }),
    [mode]
  );
  const muiTheme = useMemo(() => buildTheme(mode), [mode]);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={mode === 'dark' ? darkTheme() : lightTheme()} modalSize="compact">
          <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={muiTheme}>
              <CssBaseline />
              <HashRouter>
                <Routes>
                  <Route element={<Main />}>
                    <Route index element={<SwapView />} />
                    <Route path="swap/:swapId" element={<ExecuteView />} />
                    <Route path="wrap" element={<WrapView />} />
                  </Route>
                </Routes>
              </HashRouter>
            </ThemeProvider>
          </ColorModeContext.Provider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
