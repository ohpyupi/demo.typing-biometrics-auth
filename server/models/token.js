const crypto = require('crypto');
const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  token: { type: String, required: true, default: () => crypto.randomBytes(16).toString('hex') },
  createdAt: {
    type: Number,
    required: true,
    default: Date.now,
    expires: 300,
  },
});

const Token = mongoose.model('Token', TokenSchema);

module.exports = {
  Token,
};
