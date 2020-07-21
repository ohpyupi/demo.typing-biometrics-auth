import gql from 'graphql-tag';

export const typeDefs = gql`
  type Notification {
    type: String
    message: String
  }

  extend type Query {
    notification: Notification
    idToken: String
  }
`;