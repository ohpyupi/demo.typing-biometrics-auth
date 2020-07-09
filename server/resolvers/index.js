const { appInfo } = require('./app-info');
const { login } = require('./login');
const { signup } = require('./signup');
const { confirm } = require('./confirm');

const resolvers = {
  Query: {
    appInfo,
  },
  Mutation: {
    login,
    signup,
    confirm,
  },
};

module.exports = { resolvers };
