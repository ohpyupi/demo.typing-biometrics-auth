const { ApolloError } = require('apollo-server-express');
const { Challenge } = require('../models/challenge');
const { Device } = require('../models/device');
const {
  getKsdnaApiAccessToken,
  approveKsdnaNewDevice,
} = require('../services/keystroke-dna');

const confirmDevice = async (parent, { code }) => {
  if (!code) {
    throw new ApolloError('invalid_code', 400);
  }
  const { _deviceId } = await Challenge.findOne({ code }) || {};
  if (!_deviceId) {
    throw new ApolloError('invalid_code', 400);
  }
  const device = await Device.findOne({ _id: _deviceId });
  if (!device) {
    throw new ApolloError('invalid_code', 400);
  }
  device.isConfirmed = true;
  await device.save();
  const ksdnaToken = await getKsdnaApiAccessToken();
  const { success } = await approveKsdnaNewDevice(ksdnaToken.access_token, device);
  if (!success) {
    throw new ApolloError('Something went wrong!', 500);
  }
  return {
    message: 'Successfully approved your new device!',
  };
};

module.exports = {
  confirmDevice,
};
