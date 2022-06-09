import React from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import Routes from './Routes';
import Page from './components/Page';

import 'react-lazy-load-image-component/src/effects/blur.css';
import 'aos/dist/aos.css';

import 'scss/react-images.scss';

const browserHistory = createBrowserHistory();

const App = () => {
  return (
    <Page>
      <Router history={browserHistory}>
        <Routes />
      </Router>
    </Page>
  );
};

export default App;
