const getIpAddress = (req) => {
  let ipAddr = req.headers['x-forwarded-for'];
  if (ipAddr) {
    const list = ipAddr.split(',');
    ipAddr = list[list.length - 1];
  } else {
    ipAddr = req.connection.remoteAddress;
  }
  return ipAddr;
};

module.exports = {
  getIpAddress,
};
