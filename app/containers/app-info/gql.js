import gql from 'graphql-tag';

export const GET_APP_INFO = gql`
{
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