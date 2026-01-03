const { authenticate, generateToken } = require('./auth');
const { errorHandler, notFound } = require('./errorHandler');

module.exports = {
  authenticate,
  generateToken,
  errorHandler,
  notFound
};
