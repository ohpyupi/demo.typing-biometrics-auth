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
        $publicCredential: String!,
        $privateCredential: String!,
        $typingBiometricSignature: String!
    ) {
        login(publicCredential: $publicCredential, privateCredential: $privateCredential, typingBiometricSignature: $typingBiometricSignature) {
            token
            authenticated
            message
            ksdna {
                signatureId
                success
                failed
                deviceHash
                completeness
                status
                score
            }
        }
    }
`;

export const SIGNUP = gql`
    mutation signup(
        $publicCredential: String!
        $privateCredential: String!
    ) {
        signup(publicCredential: $publicCredential privateCredential: $privateCredential) {
            message
        }
    }
`;

export const CONFIRM = gql`
    mutation confirm(
        $token: String!
    ) {
        confirm(token: $token) {
            message
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