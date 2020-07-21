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
import { getApolloClient } from './apollo-client';
import { AppInfo } from './containers/app-info';
import { Login } from './containers/auth/login';
import { Signup } from './containers/auth/signup';
import { Confirm } from './containers/auth/confirm';
import { Profile } from './containers/users/profile';

const bootstrap = async () => {
  const apolloClient = await getApolloClient();
  ReactDOM.render(
    <ApolloProvider client={apolloClient}>
      <Router basename="/">
        <Switch>
          <Route path="/app-info">
            <AppInfo />
          </Route>
          <Route path="/user/profile">
            <Profile />
          </Route>
          <Route path="/confirm/:token">
            <Confirm />
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/">
            <Login />
          </Route>
        </Switch>
      </Router>
    </ApolloProvider>,
    document.getElementById('app'),
  );
};

bootstrap();