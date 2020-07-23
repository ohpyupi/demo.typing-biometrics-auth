const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
  _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  deviceHash: { type: String, required: true },
  createdAt: { type: Number, default: Date.now },
  isConfirmed: { type: Boolean, default: false },
});

const Device = mongoose.model('Device', DeviceSchema);

module.exports = {
  Device,
};