import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { loadKeystrokeDna } from '../../services/keystroke-dna';
import { Spinner } from '../../components/spinner';
import { Notification } from '../../components/notification';
import { Input } from '../../components/input';
import { Button } from '../../components/button';
import { LOGIN } from '../../queries/auth';
import { GET_NOTIFICATION, UPDATE_NOTIFICATION } from '../../queries/notification';
import { ERRORS } from '../../lib/constants';
import './styles.scss';

export const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [publicCredential, setPublicCredential] = useState('');
  const [privateCredential, setPrivateCredential] = useState('');
  const [typingBiometric, setTypingBiometric] = useState([]);
  const { data: { notification } } = useQuery(GET_NOTIFICATION);
  const [updateNotification] = useMutation(UPDATE_NOTIFICATION);
  const [loginMutation, { data, loading }] = useMutation(LOGIN, {
    onCompleted(result) {
      const isBlocked = _.get(result, 'login.isBlocked');
      const authenticated = _.get(result, 'login.authenticated', false);
      const loginMessage = _.get(result, 'login.message', '');
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
      updateNotification({
        variables: {
          type: 'success',
          message: loginMessage,
        },
      });
      return setIsLoggedIn(true);
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
  const ksdna = _.get(data, 'login.ksdna', {});
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
  if (loading) {
    return <Spinner/>;
  }
  return (
    <section id="login" className="section">
      <div className="container">
        <h1 className="title">Login</h1>
        <div className="content">
          {
            isLoggedIn
              ? <form>
                  {notification.message ? <Notification className="is-success" onClose={handleCloseErrorMessage} message={notification.message} /> : null }
                  <div className="table-container">
                    <table className="table">
                      <tbody>
                        {Object.keys(ksdna).map((key, idx) => <tr key={`tr${idx}`}>
                          <th>{key}</th>
                          <th>{ksdna[key].toString()}</th>
                        </tr>)}
                      </tbody>
                    </table>
                  </div>
                </form>
              : <form onSubmit={handleFormSubmit}>
                {notification.message ? <Notification className="is-warning" onClose={handleCloseErrorMessage} message={notification.message} /> : null}
                <Input label="Email" type="text" className="email-field" placeholder="Email" value={publicCredential} onChange={handleEmailChange} attrs={{ ksdna: 'true' }} />
                <Input label="Password" type="password" className="password-field" placeholder="Password" value={privateCredential} onChange={handlePasswordChange} />
                <Button type="submit" placeholder="Login" />
              </form>
          }
        </div>
      </div>
    </section>
  );
};
