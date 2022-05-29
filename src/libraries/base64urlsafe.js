/* eslint-disable no-plusplus */

function padString(input) {
  const segmentLength = 4;
  const stringLength = input.length;
  const diff = stringLength % segmentLength;
  if (!diff) {
    return input;
  }
  let padLength = segmentLength - diff;
  while (padLength--) {
    input += '=';
  }
  return input;
}

exports.urlSafeToBase64 = (base64url) => {
  base64url = '' + base64url;
  return padString(base64url)
    // .replace(/\-/g, '+')
    .replace(/-/g, '+')
    .replace(/_/g, '/');
};

exports.base64ToUrlSafe = (base64) => {
  return base64
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};
