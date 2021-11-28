import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import {
  IndexView,
} from './views';


const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" render={() => <IndexView />} />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default Routes;
