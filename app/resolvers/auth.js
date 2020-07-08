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
