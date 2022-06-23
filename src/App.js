import React from 'react';
import Page from './components/Page';
import { SwapView, ExecuteView } from './views';

import 'react-lazy-load-image-component/src/effects/blur.css';
import 'aos/dist/aos.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <Page>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SwapView />} />
          <Route path="/swap/:swapId" element={<ExecuteView />} />
          <Route path="*" element={<SwapView />} />
        </Routes>
      </BrowserRouter>
    </Page>
  );
};

export default App;
