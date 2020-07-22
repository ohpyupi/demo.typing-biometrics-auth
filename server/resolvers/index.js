const { appInfo } = require('./app-info');
const { login } = require('./login');
const { signup } = require('./signup');
const { confirm } = require('./confirm');
const { user } = require('./user');
const { resendChallenge } = require('./resendChallenge');
const { solveChallenge } = require('./solveChallenge');

const resolvers = {
  Query: {
    appInfo,
    user,
  },
  Mutation: {
    login,
    signup,
    confirm,
    resendChallenge,
    solveChallenge,
  },
};

module.exports = { resolvers };
