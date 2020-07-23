import gql from 'graphql-tag';
import { updateLocalStorage } from '../lib/localStorage';

export const GET_ID_TOKEN = gql`
  query getIdToken {
    idToken @client
  }
`;

export const UPDATED_ID_TOKEN = gql`
  mutation updateIdToken($idToken: String) {
    updateIdToken(idToken: $idToken) @client
  }
`;

export const LOGIN = gql`
  mutation login(
    $publicCredential: String!
    $privateCredential: String!
    $typingBiometricSignature: String!
  ) {
    login(
      publicCredential: $publicCredential
      privateCredential: $privateCredential
      typingBiometricSignature: $typingBiometricSignature
    ) {
      idToken
      isAuthenticated
      isChallengeRequired
      message
   }
  }
`;

export const SIGNUP = gql`
  mutation signup(
    $publicCredential: String!
    $privateCredential: String!
    $typingBiometricSignature: String!
  ) {
    signup(
      publicCredential: $publicCredential
      privateCredential: $privateCredential
      typingBiometricSignature: $typingBiometricSignature
    ) {
      message
    }
  }
`;

export const CONFIRM_EMAIL = gql`
  mutation confirmEmail(
    $code: String!
  ) {
    confirmEmail(code: $code) {
      message
    }
  }
`;

export const CONFIRM_DEVICE = gql`
  mutation confirmDevice(
    $code: String!
  ) {
    confirmDevice(code: $code) {
      message
    }
  }
`;

export const RESEND_CHALLENGE = gql`
  mutation resendChallenge {
    resendChallenge {
      message
    }
  }
`;

export const SOLVE_CHALLENGE = gql`
  mutation solveChallenge($code: String!) {
    solveChallenge(code: $code) {
      message
      idToken
    }
  }
`;

export const updateIdToken = (_root, { idToken } = {}, { cache }) => {
  const data = cache.readQuery({
    query: GET_ID_TOKEN,
  }) || {};
  data.idToken = idToken;
  cache.writeData({
    data,
  });
  updateLocalStorage({
    idToken,
  });
  return null;
};