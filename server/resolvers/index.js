const { appInfo } = require('./app-info');
const { login } = require('./login');

const resolvers = {
  Query: {
    appInfo,
  },
  Mutation: {
    login,
  },
};

module.exports = { resolvers };