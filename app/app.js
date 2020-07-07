/* eslint no-undef: "off" */
if (process.env.NODE_ENV !== 'production') {
  /* eslint no-console: "off" */
  console.log('Looks like we are in development mode!');
}
/* eslint import/first: "off" */
import './styles.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import { apolloClient } from './apollo-client';
import { AppInfo } from './containers/app-info';
import { Login } from './containers/auth/login';
import { Signup } from './containers/auth/signup';

ReactDOM.render(
  <ApolloProvider client={apolloClient}>
    <Router>
      <Switch>
        <Route path="/app-info">
          <AppInfo/>
        </Route>
        <Route path="/signup">
          <Signup/>
        </Route>
        <Route path="/">
          <Login/>
        </Route>
      </Switch>
    </Router>
  </ApolloProvider>,
  document.getElementById('app'),
);
