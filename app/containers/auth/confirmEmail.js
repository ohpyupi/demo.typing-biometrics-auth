import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Spinner } from '../../components/spinner';
import { Notification } from '../../components/notification';
import { CONFIRM_EMAIL } from '../../graphql/auth';
import { GET_NOTIFICATION, UPDATE_NOTIFICATION } from '../../graphql/notification';
import './styles.scss';

export const ConfirmEmail = withRouter(({
  match: { params: { code } },
}) => {
  const [redirectTo, setRedirectTo] = useState('');
  const { data: { notification } } = useQuery(GET_NOTIFICATION);
  const [updateNotification] = useMutation(UPDATE_NOTIFICATION);
  const [confirmEmailMutation, { called, error }] = useMutation(CONFIRM_EMAIL, {
    onCompleted(result) {
      updateNotification({
        variables: {
          type: 'success',
          message: _.get(result, 'confirmEmail.message'),
        },
      }).then(() => setRedirectTo('/login'));
    },
    onError() {
      updateNotification({
        variables: {
          type: 'warning',
          message: 'Invalid token',
        },
      });
    },
  });
  useEffect(() => {
    confirmEmailMutation({
      variables: {
        code,
      },
    });
  }, []);
  const handleCloseErrorMessage = (e) => {
    e.preventDefault();
    updateNotification({});
  };
  if (redirectTo) {
    return <Redirect to={redirectTo}/>;
  }
  if (!called || !error) {
    return <Spinner/>;
  }
  return (
    <section id="confirm-email" className="section">
      <div className="container">
        <h1 className="title">Confirm your email</h1>
        <div className="content">
          <form>
            {notification.message ? <Notification className={`is-${notification.type || 'warning'}`} onClose={handleCloseErrorMessage} message={notification.message} /> : null}
          </form>
        </div>
      </div>
    </section>
  );
});
