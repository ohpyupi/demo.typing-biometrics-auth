const path = require('path');
const _ = require('lodash');
const { ApolloServer } = require('apollo-server-express');
const { loadSchemaSync } = require('@graphql-tools/load');
const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader');
const { addResolversToSchema } = require('@graphql-tools/schema');
const { validateIdToken } = require('./lib/auth');
const { resolvers } = require('./resolvers');

const schema = loadSchemaSync(path.join(__dirname, './schema/schema.graphql'), {
  loaders: [new GraphQLFileLoader()],
});

const context = ({ req }) => {
  const authorization = _.get(req, 'headers.authorization', '');
  const idToken = authorization.split('Bearer ')[1];
  return {
    req,
    idTokenPayload: validateIdToken(idToken),
  };
};

const apolloServer = new ApolloServer({
  schema: addResolversToSchema({ schema, resolvers }),
  context,
});

module.exports = {
  apolloServer,
};