import _ from 'lodash';
import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Spinner } from '../../components/spinner';
import { Input } from '../../components/input';
import { Button } from '../../components/button';
import { SIGNUP } from './gql';
import { ERRORS } from '../../lib/constants';
import './styles.scss';
import { Notification } from '../../components/notification';

export const Signup = () => {
  const [notification, setNotification] = useState({});
  const [publicCredential, setPublicCredential] = useState('');
  const [privateCredential, setPrivateCredential] = useState('');
  const [signupMutation, { loading }] = useMutation(SIGNUP, {
    onCompleted() {
      return setNotification({
        type: 'success',
        message: 'Successfully registered!',
      });
    },
    onError(err) {
      if (err.message.includes(ERRORS.SIGNUP.EXISTING_EMAIL)) {
        return setNotification({
          type: 'warning',
          message: 'Email already registered',
        });
      }
      return setNotification({
        type: 'warning',
        message: 'Something went wrong',
      });
    },
  });
  const handleEmailChange = (e) => {
    e.preventDefault();
    setPublicCredential(_.get(e, 'target.value', ''));
  };
  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPrivateCredential(_.get(e, 'target.value', ''));
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    signupMutation({
      variables: {
        publicCredential,
        privateCredential,
      },
    });
    setPublicCredential('');
    return setPrivateCredential('');
  };
  const handleCloseErrorMessage = (e) => {
    e.preventDefault();
    setNotification({});
  };
  if (loading) {
    return <Spinner/>;
  }
  return (
    <section id="signup" className="section">
      <div className="container">
        <h1 className="title">Signup</h1>
        <div className="content">
          <form onSubmit={handleFormSubmit}>
            {notification.message ? <Notification className={`is-${notification.type || 'warning'}`} onClose={handleCloseErrorMessage} message={notification.message} /> : null}
            <Input label="Email" type="text" className="email-field" placeholder="Email" value={publicCredential} onChange={handleEmailChange} attrs={{ ksdna: 'true' }} />
            <Input label="Password" type="password" className="password-field" placeholder="Password" value={privateCredential} onChange={handlePasswordChange} />
            <Button type="submit" placeholder="Signup" />
          </form>
        </div>
      </div>
    </section>
  );
};
