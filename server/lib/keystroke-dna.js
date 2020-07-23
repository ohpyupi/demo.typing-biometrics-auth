const isNewDeviceLogin = ({ status }) => status === 2;

const isDangerousLogin = ({
  success, failed, completeness, score,
}) => {
  if (success === false && failed === false) {
    return true;
  }
  if (completeness < 0.9 || score < 0.9) {
    return true;
  }
  return false;
};

module.exports = {
  isNewDeviceLogin,
  isDangerousLogin,
};