import React from 'react';
// import { Router } from 'react-router-dom';
// import { createBrowserHistory } from 'history';
// import Routes from './Routes';
import Page from './components/Page';
import { SwapView, ExecuteView } from './views';

import 'react-lazy-load-image-component/src/effects/blur.css';
import 'aos/dist/aos.css';
import { BrowserRouter, Routes } from 'react-router-dom';

// import 'scss/react-images.scss';

// const browserHistory = createBrowserHistory();

const App = () => {
  return (
    <Page>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SwapView />} />
          <Route path="/:swapId" element={<ExecuteView />} />
          <Route path="*" element={<SwapView />} />
        </Routes>
      </BrowserRouter>
    </Page>
  );
};

export default App;
