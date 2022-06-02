/**
 * @author MrZenW
 * @email MrZenW@gmail.com, https://MrZenW.com
 * @create date 2021-05-25 13:13:15
 * @modify date 2021-05-25 13:13:15
 * @desc [description]
 */
const { crc32 } = require('crc');
const { string2buffer, buffer2string } = require('$/libraries/string_and_buffer');

const negativeMask = '01469cdf';
const getNegativeMask = () => {
  return negativeMask[(Math.random() * negativeMask.length) | 0];
};
const positiveMask = '23578abe';
const getPositiveMask = () => {
  return positiveMask[(Math.random() * positiveMask.length) | 0];
};

const dividerString = '||';
const dividerBuffer = string2buffer(dividerString);

const generateContentBuffer = (contentArray) => {
  return new Uint8Array(contentArray.reduce((acc, curr) => [].concat(acc, Array.from(curr)), []));
};

exports.generate = (salt, topic, payload) => {
  let payloadBuffer;
  if (!ArrayBuffer.isView(payload)) {
    let payloadString = payload;
    if ('string' !== typeof payloadString) {
      payloadString = JSON.stringify(payloadString);
    }
    payloadBuffer = string2buffer(payloadString);
  } else {
    payloadBuffer = payload;
  }
  const content = generateContentBuffer([
    string2buffer(topic),
    dividerBuffer,
    string2buffer(salt),
    dividerBuffer,
    payloadBuffer,
  ]);
  const crc32Number = crc32(content);
  const crc32AbsNum16Fill = ('00000000' + Math.abs(crc32Number).toString(16)).slice(-8);
  if (crc32Number < 0) {
    return string2buffer(getNegativeMask() + crc32AbsNum16Fill);
  } else {
    return string2buffer(getPositiveMask() + crc32AbsNum16Fill);
  }
};

exports.check = (crc32HashBuffer, salt, topic, payload) => {
  let crc32HashString;
  if (ArrayBuffer.isView(crc32HashBuffer)) {
    crc32HashString = buffer2string(crc32HashBuffer);
  } else if ('string' !== typeof crc32HashBuffer) {
    crc32HashString = JSON.stringify(crc32HashBuffer);
  } else {
    crc32HashString = crc32HashBuffer;
  }
  let payloadBuffer = payload;
  if ('string' === typeof payload) {
    payloadBuffer = string2buffer(payload);
  }
  const content = generateContentBuffer([
    string2buffer(topic),
    dividerBuffer,
    string2buffer(salt),
    dividerBuffer,
    payloadBuffer,
  ]);
  // const content = topic + '||' + salt + '||' + payload;
  const crc32Number = crc32(content);
  const crc32AbsNum16Fill = ('00000000' + Math.abs(crc32Number).toString(16)).slice(-8);
  if (crc32Number < 0) {
    if (negativeMask.indexOf(crc32HashString[0]) === -1) return false;
  } else {
    if (positiveMask.indexOf(crc32HashString[0]) === -1) return false;
  }
  return crc32HashString === (crc32HashString[0] + crc32AbsNum16Fill);
};
