import React from 'react';
import Page from './components/Page';
import { SwapView, ExecuteView, WrapView } from './views';

import 'react-lazy-load-image-component/src/effects/blur.css';
import 'aos/dist/aos.css';
import { HashRouter, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <Page>
      <HashRouter>
        <Routes>
          <Route path="/" element={<SwapView />} />
          <Route path="swap/:swapId" element={<ExecuteView />} />
          <Route path="wrap" element={<WrapView />} />'
          <Route path="*" element={<SwapView />} />
        </Routes>
      </HashRouter>
    </Page>
  );
};

export default App;
