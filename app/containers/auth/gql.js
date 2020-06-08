import gql from 'graphql-tag';

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