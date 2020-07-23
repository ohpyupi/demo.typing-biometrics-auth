const crypto = require('crypto');
const mongoose = require('mongoose');

const ChallengeSchema = new mongoose.Schema({
  _userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  _deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device' },
  code: { type: String, required: true, default: () => crypto.randomBytes(16).toString('hex') },
  createdAt: {
    type: Number,
    required: true,
    default: Date.now,
    expires: 300,
  },
});

const Challenge = mongoose.model('Challenge', ChallengeSchema);

module.exports = {
  Challenge,
};