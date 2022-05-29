/**
 * @author MrZenW
 * @email mrzenw@gmail.com, https://mrzenw.com
 * @create date 2021-05-25 13:13:49
 * @modify date 2021-05-28 09:58:22
 * @desc [description]
 */
exports.string2buffer = (string) => {
  return new Uint8Array((string + '').split('').reduce((acc, curr) => [].concat(acc, [curr.charCodeAt(0)]), []));
};

exports.buffer2string = (buffer) => {
  if (!ArrayBuffer.isView(buffer)) throw new Error('Need an ArrayBuffer as the first argument!');
  return buffer.reduce((acc, curr) => acc + String.fromCharCode(curr), '');
};
