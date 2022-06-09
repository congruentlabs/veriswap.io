import React from 'react';
import { createRoot } from 'react-dom/client';
import { DAppProvider } from '@usedapp/core';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <DAppProvider>
    <App />
  </DAppProvider>
);
