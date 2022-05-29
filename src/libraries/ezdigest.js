/**
 * @author MrZenW
 * @email mrzenw@gmail.com, https://mrzenw.com
 * @create date 2021-05-27 13:54:45
 * @modify date 2021-05-27 14:35:07
 * @desc [description]
 */
const { crc32 } = require('crc');
const { string2buffer, buffer2string } = require('./string_and_buffer');

// const defaultSalt = 'dee65d1c-3edb-47b9-91a3-eb3a69ee3899';
const defaultSalt = '5910c509-0b39-44aa-b5aa-9e77c9a22c8a--36be05db-6344-40a8-922f-f371a2a1b019--827d1401-8614-4fa0-be36-a08c7575ff20--485e2f6d-478a-4bbd-a9ec-d53991d93b6c';
const negativeMask = '01469cdf';
const getNegativeMask = () => {
  return negativeMask[(Math.random() * negativeMask.length) | 0];
};
const checkNegativeMask = (crcString) => {
  return negativeMask.indexOf((crcString + '').charAt(0)) !== -1;
};

const positiveMask = '23578abe';
const getPositiveMask = () => {
  return positiveMask[(Math.random() * positiveMask.length) | 0];
};
const checkPositiveMask = (crcString) => {
  return positiveMask.indexOf((crcString + '').charAt(0)) !== -1;
};

const dividerString = '||';
const dividerBuffer = string2buffer(dividerString);

const generateContentBuffer = (contentArray) => {
  return new Uint8Array(contentArray.reduce((acc, curr) => [].concat(acc, Array.from(curr)), []));
};

exports.digest = (payload, salt) => {
  salt = salt || defaultSalt;
  let payloadBuffer;
  if (!ArrayBuffer.isView(payload)) {
    payloadBuffer = string2buffer(payload);
  } else {
    payloadBuffer = payload;
  }
  const context = generateContentBuffer([
    string2buffer(salt),
    dividerBuffer,
    payloadBuffer,
  ]);
  const crc32Number = crc32(context);
  const crc32AbsNum16Fill = ('00000000' + Math.abs(crc32Number).toString(16)).slice(-8);
  const mask = (crc32Number < 0) ? getNegativeMask() : getPositiveMask();
  const string = mask + crc32AbsNum16Fill;
  return {
    string,
    buffer: string2buffer(string),
  };
};

exports.checkDigest = (crc32HashBuffer, payload, salt) => {
  salt = salt || defaultSalt;
  let crc32HashString;
  if (ArrayBuffer.isView(crc32HashBuffer)) {
    crc32HashString = buffer2string(crc32HashBuffer);
  } else {
    crc32HashString = crc32HashBuffer;
  }
  const { string: digestString } = exports.digest(payload, salt);
  return (
    checkPositiveMask(digestString) === checkPositiveMask(crc32HashString)
    && checkNegativeMask(digestString) === checkNegativeMask(crc32HashString)
    && digestString.slice(1) === crc32HashString.slice(1)
  );
};
