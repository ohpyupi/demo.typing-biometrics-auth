import _ from 'lodash';
import React, { Fragment, useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_ID_TOKEN, UPDATED_ID_TOKEN } from '../../graphql/auth';
import { UPDATE_NOTIFICATION } from '../../graphql/notification';
import { GET_USER } from '../../graphql/user';
import { Input } from '../../components/input';
import { Button } from '../../components/button';
import './styles.scss';
import { Spinner } from '../../components/spinner';

export const Profile = () => {
  const [user, setUser] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [redirectTo, setRedirectTo] = useState('');
  const [updateIdToken] = useMutation(UPDATED_ID_TOKEN);
  const [updateNotification] = useMutation(UPDATE_NOTIFICATION);
  const { data: getIdTokenData } = useQuery(GET_ID_TOKEN);
  const { loading } = useQuery(GET_USER, {
    variables: {
      idToken: getIdTokenData.idToken,
    },
    onCompleted(result) {
      setUser(_.get(result, 'user', {}));
    },
    onError() {
      updateIdToken({
        variables: {
          idToken: '',
        },
      }).then(() => setRedirectTo('/login'));
    },
    skip: !getIdTokenData.idToken,
  });
  const handleToggleEdit = (e) => {
    e.preventDefault();
    setIsEditMode(!isEditMode);
  };
  const handleClickSave = (e) => {
    e.preventDefault();
    /* eslint no-alert: "off" */
    alert('Work in progress!');
  };
  useEffect(() => {
    if (!getIdTokenData.idToken) {
      updateNotification({
        variables: {
          type: 'warning',
          message: 'You are required to login!',
        },
      }).then(() => setRedirectTo('/login'));
    }
  }, []);
  const renderButtons = () => {
    if (!isEditMode) {
      return <Button type="button" placeholder="Edit" onClick={handleToggleEdit}/>;
    }
    return <Fragment>
      <Button type="button" placeholder="Save" onClick={handleClickSave} />
      <Button type="button" placeholder="Cancel" className="button is-danger" onClick={handleToggleEdit} />
    </Fragment>;
  };
  if (loading) {
    return <Spinner/>;
  }
  if (redirectTo) {
    return <Redirect to={redirectTo}/>;
  }
  return (
    <section id="profile" className="section">
      <div className="container">
        <h1 className="title">Profile</h1>
        <div className="content">
          <form>
            <figure className="image is-128x128">
              <img src="https://bulma.io/images/placeholders/128x128.png" />
            </figure>
            <Input label="First Name" type="text" className="first-name-field" placeholder="First Name" value={user.firstName} disabled={!isEditMode}/>
            <Input label="Last Name" type="text" className="last-name-field" placeholder="Last Name" value={user.lastName} disabled={!isEditMode}/>
            <Input label="Email" type="text" className="email-field" placeholder="Email" value={user.email} disabled={!isEditMode}/>
            {renderButtons()}
          </form>
        </div>
      </div>
    </section>
  );
};