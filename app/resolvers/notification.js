import _ from 'lodash';
import gql from 'graphql-tag';

export const GET_NOTIFICATION = gql`
  query getNotification {
    notification @client {
      type 
      message
    }
  }
`;

export const UPDATE_NOTIFICATION = gql`
  mutation updateNotification($type: String $message: String) {
    updateNotification(type: $type message: $message) @client
  }
`;

export const updateNotification = (_root, { type, message } = {}, { cache }) => {
  const data = cache.readQuery({
    query: GET_NOTIFICATION,
  }) || {};
  data.notification = {
    ..._.get(data, 'notification', {}),
    type,
    message,
  };
  cache.writeData({
    data,
  });
  return null;
};
