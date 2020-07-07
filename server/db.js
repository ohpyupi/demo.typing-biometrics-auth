const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config/variables');

/**
 * Initialize the MongoDB database
 * @returns {Promise<void>}
 */
const initDatabase = () => new Promise((resolve, reject) => {
  mongoose.connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  mongoose.connection.once('open', resolve);
  mongoose.connection.once('error', reject);
});

module.exports = {
  initDatabase,
};
