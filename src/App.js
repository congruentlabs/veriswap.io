import React from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import Routes from './Routes';
import Page from './components/Page';

import 'react-lazy-load-image-component/src/effects/blur.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'aos/dist/aos.css';

import 'scss/react-images.scss';
import 'scss/slick-slider.scss';

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
