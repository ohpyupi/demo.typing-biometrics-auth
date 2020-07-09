import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { updateNotification } from './queries/notification';

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  resolvers: {
    Mutation: {
      updateNotification,
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
  },
});
