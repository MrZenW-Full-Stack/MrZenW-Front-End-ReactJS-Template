const ip = require('ip');

let ipAddress = null;
if (!ipAddress) {
  try {
    ipAddress = ip.address('en0');
  } catch (error) {
    console.error(error);
    ipAddress = ip.loopback('ipv4');
  }
}

exports.ipAddress = ipAddress;
