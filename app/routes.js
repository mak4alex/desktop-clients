import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import ClientsPage from './containers/ClientsPage';


export default (
  <Route path="/" component={App}>
    <IndexRoute component={ClientsPage} />
  </Route>
);
