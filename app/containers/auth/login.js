import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { loadKeystrokeDna } from '../../services/keystroke-dna';
import { Spinner } from '../../components/spinner';
import { Notification } from '../../components/notification';
import { Input } from '../../components/input';
import { Button } from '../../components/button';
import { LOGIN } from './gql';
import './styles.scss';

export const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [publicCredential, setPublicCredential] = useState('');
  const [privateCredential, setPrivateCredential] = useState('');
  const [typingBiometric, setTypingBiometric] = useState([]);
  const [loginMutation, { data, loading }] = useMutation(LOGIN, {
    onCompleted(data) {
      const isBlocked = _.get(data, 'login.isBlocked');
      const authenticated = _.get(data, 'login.authenticated', false);
      const loginMessage = _.get(data, 'login.message', '');
      if (isBlocked || !authenticated && loginMessage) {
        setPublicCredential('');
        setPrivateCredential('');
        setPublicCredential([]);
        window.KSDNA.init();
        return setErrorMessage(loginMessage);
      }
      setErrorMessage(loginMessage);
      return setIsLoggedIn(true);
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
      return setErrorMessage('Email and password are required.');
    }
    loginMutation({
      variables: {
        publicCredential,
        privateCredential,
        typingBiometricSignature: window.KSDNA.prepareSignature('email', typingBiometric),
      },
    });
  };
  const handleCloseErrorMessage = (e) => {
    e.preventDefault();
    setErrorMessage('');
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
            isLoggedIn ?
              <div>
                <Notification className="is-success" onClose={handleCloseErrorMessage} message={errorMessage} />
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
              </div> :
              <form onSubmit={handleFormSubmit}>
                {errorMessage ? <Notification className="is-warning" onClose={handleCloseErrorMessage} message={errorMessage} /> : null}
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