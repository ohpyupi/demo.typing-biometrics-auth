import gql from 'graphql-tag';

export const GET_USER = gql`
    query getUser {
      user {
        email
        firstName
        lastName
        isConfirmed
        createdAt
      }
    }
`;