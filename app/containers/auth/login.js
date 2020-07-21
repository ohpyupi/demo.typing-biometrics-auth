import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { loadKeystrokeDna } from '../../services/keystroke-dna';
import { Spinner } from '../../components/spinner';
import { Notification } from '../../components/notification';
import { Input } from '../../components/input';
import { Button } from '../../components/button';
import { LOGIN, GET_ID_TOKEN, UPDATED_ID_TOKEN } from '../../graphql/auth';
import { GET_NOTIFICATION, UPDATE_NOTIFICATION } from '../../graphql/notification';
import { ERRORS } from '../../lib/constants';
import './styles.scss';

export const Login = () => {
  const [redirectTo, setRedirectTo] = useState('');
  const [publicCredential, setPublicCredential] = useState('');
  const [privateCredential, setPrivateCredential] = useState('');
  const [typingBiometric, setTypingBiometric] = useState([]);
  const { data: { idToken } } = useQuery(GET_ID_TOKEN);
  const { data: { notification } } = useQuery(GET_NOTIFICATION);
  const [updateNotification] = useMutation(UPDATE_NOTIFICATION);
  const [updateIdToken] = useMutation(UPDATED_ID_TOKEN);
  const [loginMutation, { loading }] = useMutation(LOGIN, {
    onCompleted(result) {
      const isBlocked = _.get(result, 'login.isBlocked');
      const authenticated = _.get(result, 'login.authenticated', false);
      const loginMessage = _.get(result, 'login.message', 'Something went wrong');
      /* eslint no-mixed-operators: "off" */
      if (isBlocked || !authenticated && loginMessage) {
        setPublicCredential('');
        setPrivateCredential('');
        window.KSDNA.init();
        return updateNotification({
          variables: {
            type: 'warning',
            message: loginMessage,
          },
        });
      }
      updateIdToken({
        variables: {
          idToken: _.get(result, 'login.token'),
        },
      });
      return setRedirectTo('/user/profile');
    },
    onError({ message = '' }) {
      if (message.includes(ERRORS.LOGIN.INVALID_CREDENTIALS)) {
        return updateNotification({
          variables: {
            type: 'warning',
            message: 'Please check your credentials.',
          },
        });
      }
      if (message.includes(ERRORS.LOGIN.USER_NOT_CONFIRMED)) {
        return updateNotification({
          variables: {
            type: 'warning',
            message: 'Please verify your email to login.',
          },
        });
      }
      return updateNotification({
        variables: {
          type: 'warning',
          message: 'Something went wrong',
        },
      });
    },
  });
  const handleEmailChange = (e) => {
    e.preventDefault();
    setPublicCredential(_.get(e, 'target.value', ''));
    setTypingBiometric(_.get(e, 'target.ksdna._dataset', ''));
  };
  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPrivateCredential(_.get(e, 'target.value', ''));
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!publicCredential || !privateCredential) {
      return updateNotification({
        variables: {
          type: 'warning',
          message: 'Email and password are required.',
        },
      });
    }
    return loginMutation({
      variables: {
        publicCredential,
        privateCredential,
        typingBiometricSignature: window.KSDNA.prepareSignature('email', typingBiometric),
      },
    });
  };
  const handleCloseErrorMessage = (e) => {
    e.preventDefault();
    updateNotification({});
  };
  useEffect(() => {
    loadKeystrokeDna({
      appId: process.env.KEYSTROKE_DNA_APP_ID,
      onLoad() {
        window.KSDNA.ready(() => {
          window.KSDNA.init();
        });
      },
    });
  }, []);
  useEffect(() => {
    if (idToken) {
      setRedirectTo('/user/profile');
    }
  }, []);
  if (loading) {
    return <Spinner/>;
  }
  if (redirectTo) {
    return <Redirect to={redirectTo}/>;
  }
  return (
    <section id="login" className="section">
      <div className="container">
        <h1 className="title">Login</h1>
        <div className="content">
          <form onSubmit={handleFormSubmit}>
            {notification.message ? <Notification className="is-warning" onClose={handleCloseErrorMessage} message={notification.message} /> : null}
            <Input label="Email" type="text" className="email-field" placeholder="Email" value={publicCredential} onChange={handleEmailChange} attrs={{ ksdna: 'true' }} />
            <Input label="Password" type="password" className="password-field" placeholder="Password" value={privateCredential} onChange={handlePasswordChange} />
            <Button type="submit" placeholder="Login" />
          </form>
        </div>
      </div>
    </section>
  );
};
