/**
 * @author MrZenW
 * @email mrzenw@gmail.com, https://mrzenw.com
 * @create date 2021-06-17 17:32:54
 * @modify date 2021-09-03 14:15:14
 * @desc [description]
 */
exports.promiseSleep = (ms) => {
  ms = parseInt(ms, 10);
  if (Number.isNaN(ms) || ms <= 0) return Promise.reject(new Error('Parameter ms mush be a number and great than 0!'));
  return new Promise((resolve) => {
    setTimeout(resolve, ms | 0);
  });
};
