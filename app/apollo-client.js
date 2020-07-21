import _ from 'lodash';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { updateNotification } from './graphql/notification';
import { typeDefs } from './graphql/typeDefs';
import { updateIdToken } from './graphql/auth';
import { getLocalStorage } from './lib/localStorage';

const localStorage = getLocalStorage();

export const getApolloClient = async () => {
  const apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    typeDefs,
    resolvers: {
      Mutation: {
        updateNotification,
        updateIdToken,
      },
    },
    link: new HttpLink({ uri: '/graphql' }),
  });
  apolloClient.writeData({
    data: {
      notification: {
        __typename: 'Notification',
        type: '',
        message: '',
      },
      idToken: _.get(localStorage, 'idToken', ''),
    },
  });
  return apolloClient;
};