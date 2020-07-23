const { appInfo } = require('./app-info');
const { login } = require('./login');
const { signup } = require('./signup');
const { confirmEmail } = require('./confirmEmail');
const { user } = require('./user');
const { resendChallenge } = require('./resendChallenge');
const { solveChallenge } = require('./solveChallenge');
const { confirmDevice } = require('./confirmDevice');

const resolvers = {
  Query: {
    appInfo,
    user,
  },
  Mutation: {
    login,
    signup,
    confirmEmail,
    resendChallenge,
    solveChallenge,
    confirmDevice,
  },
};

module.exports = { resolvers };
