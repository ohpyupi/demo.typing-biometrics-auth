import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Input } from '../../components/input';
import { Button } from '../../components/button';
import { Notification } from '../../components/notification';
import { parseJwtSafe } from '../../lib/utils';
import { GET_ID_TOKEN, RESEND_CHALLENGE, SOLVE_CHALLENGE, UPDATED_ID_TOKEN } from '../../graphql/auth';
import { AUTH_STATUS } from '../../lib/constants';
import { GET_NOTIFICATION, UPDATE_NOTIFICATION } from '../../graphql/notification';

export const Challenge = () => {
  const [redirectTo, setRedirectTo] = useState('');
  const [challengeCode, setChallengeCode] = useState('');
  const { data: { idToken } } = useQuery(GET_ID_TOKEN);
  const { data: { notification } } = useQuery(GET_NOTIFICATION);
  const [updateNotification] = useMutation(UPDATE_NOTIFICATION);
  const [updateIdToken] = useMutation(UPDATED_ID_TOKEN);
  const [resendChallenge] = useMutation(RESEND_CHALLENGE, {
    onCompleted(result) {
      const message = _.get(result, 'resendChallenge.message');
      return updateNotification({
        type: 'success',
        message,
      });
    },
    onError(err) {
      const message = _.get(err, 'message', 'Something went wrong');
      return updateNotification({
        type: 'warning',
        message,
      });
    },
  });
  const [solveChallenge] = useMutation(SOLVE_CHALLENGE, {
    onCompleted(result) {
      const newIdToken = _.get(result, 'solveChallenge.idToken');
      return updateIdToken({
        variables: {
          idToken: newIdToken,
        },
      }).then(() => setRedirectTo('/user/profile'));
    },
    onError(err) {
      const message = _.get(err, 'message', 'Something went wrong');
      return updateNotification({
        type: 'warning',
        message,
      });
    },
  });
  const idTokenPayload = parseJwtSafe(idToken);
  const email = _.get(idTokenPayload, 'email');
  const status = _.get(idTokenPayload, 'status');
  const handleCloseErrorMessage = (e) => {
    e.preventDefault();
    updateNotification({});
  };
  const handleChallengeCodeChange = (e) => {
    e.preventDefault();
    setChallengeCode(_.get(e, 'target.value', ''));
  };
  const handleClickResend = (e) => {
    e.preventDefault();
    resendChallenge();
  };
  const handleClickSubmit = (e) => {
    e.preventDefault();
    solveChallenge({
      variables: {
        code: challengeCode,
      },
    });
  };
  useEffect(() => {
    if (!email) {
      setRedirectTo('/login');
    }
    if (status === AUTH_STATUS.LOGGED_IN) {
      setRedirectTo('/user/profile');
    }
  }, []);
  if (redirectTo) {
    return <Redirect to={redirectTo}/>;
  }
  return (
    <section id="challenge" className="section">
      <div className="container">
        <h1 className="title">Solve Challenge</h1>
        <div className="content">
          <form>
            {notification.message ? <Notification className="is-warning" onClose={handleCloseErrorMessage} message={notification.message} /> : null}
            <Input label="Email" type="text" className="email-field" placeholder="Email" value={email} disabled={true} readOnly={true}/>
            <Input label="Challenge Code" type="text" className="challengecode-field" value={challengeCode} placeholder="Challenge Code" onChange={handleChallengeCodeChange}/>
            <Button type="button" className="button is-link" placeholder="Submit" onClick={handleClickSubmit}/>
            <Button type="button" placeholder="Resend" onClick={handleClickResend}/>
          </form>
        </div>
      </div>
    </section>
  );
};
