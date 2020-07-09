import React, { useState, useEffect } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Spinner } from '../../components/spinner';
import { Notification } from '../../components/notification';
import { CONFIRM } from '../../queries/auth';
import { GET_NOTIFICATION, UPDATE_NOTIFICATION } from '../../queries/notification';
import './styles.scss';

export const Confirm = withRouter(({ match: { params: { token } } }) => {
  const [redirectTo, setRedirectTo] = useState('');
  const { data: { notification } } = useQuery(GET_NOTIFICATION);
  const [updateNotification] = useMutation(UPDATE_NOTIFICATION);
  const [confirmMutation, { called, error }] = useMutation(CONFIRM, {
    onCompleted() {
      updateNotification({
        variables: {
          type: 'success',
          message: 'Successfully verified your email, please login!',
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
    confirmMutation({
      variables: {
        token,
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
    <section id="confirm" className="section">
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
