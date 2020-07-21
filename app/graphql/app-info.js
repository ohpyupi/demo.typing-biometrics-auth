import gql from 'graphql-tag';

export const GET_APP_INFO = gql`
query getAppInfo {
  appInfo {
    name
    version
    description
    homepage
    contributors {
      name
      email
      url
    }
    dependencies
  }
}
`;