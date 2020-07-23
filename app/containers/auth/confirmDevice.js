import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { GET_NOTIFICATION, UPDATE_NOTIFICATION } from '../../graphql/notification';
import { CONFIRM_DEVICE } from '../../graphql/auth';
import { Spinner } from '../../components/spinner';
import { Notification } from '../../components/notification';

export const ConfirmDevice = withRouter(({
  match: { params: { code } },
}) => {
  const { data: { notification } } = useQuery(GET_NOTIFICATION);
  const [updateNotification] = useMutation(UPDATE_NOTIFICATION);
  const [confirmDeviceMutation, { called, loading }] = useMutation(CONFIRM_DEVICE, {
    onCompleted(result) {
      updateNotification({
        variables: {
          type: 'success',
          message: _.get(result, 'confirmDevice.message'),
        },
      });
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
    confirmDeviceMutation({
      variables: {
        code,
      },
    });
  }, []);
  const handleCloseErrorMessage = (e) => {
    e.preventDefault();
    updateNotification({});
  };
  if (!called || loading) {
    return <Spinner/>;
  }
  return (
    <section id="confirm-device" className="section">
      <div className="container">
        <h1 className="title">Confirm your device</h1>
        <div className="content">
          <form>
            {notification.message ? <Notification className={`is-${notification.type || 'warning'}`} onClose={handleCloseErrorMessage} message={notification.message} /> : null}
          </form>
        </div>
      </div>
    </section>
  );
});