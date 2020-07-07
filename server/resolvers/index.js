const { appInfo } = require('./app-info');
const { login } = require('./login');
const { signup } = require('./signup');

const resolvers = {
  Query: {
    appInfo,
  },
  Mutation: {
    login,
    signup,
  },
};

module.exports = { resolvers };
