import gql from 'graphql-tag';

export const GET_USER = gql`
    query getUser($idToken: String) {
      user(idToken: $idToken) {
        email
        firstName
        lastName
        isConfirmed
        createdAt
      }
    }
`;