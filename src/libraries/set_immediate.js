/**
 * @author MrZenW
 * @email mrzenw@gmail.com, https://mrzenw.com
 * @create date 2021-05-25 13:13:40
 * @modify date 2021-05-25 13:13:40
 * @desc [description]
 */
exports.setImmediate = function (cb, ...rest) {
  return setTimeout(cb, 0, ...rest);
};

exports.clearImmediate = function (handdleId) {
  return clearTimeout(handdleId);
};
