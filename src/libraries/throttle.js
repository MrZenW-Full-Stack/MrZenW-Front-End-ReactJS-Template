/**
 * @author MrZenW
 * @email mrzenw@gmail.com, https://mrzenw.com
 * @create date 2021-05-25 13:14:22
 * @modify date 2021-05-25 13:14:23
 * @desc [description]
 */
const MINIMUM_GAP = 0.3 * 1e3;

module.exports = (func, t) => {
  if ('function' !== typeof func) throw new Error('The first argument must be a function!');
  t = parseFloat(t) || 0;
  if (t <= 0) t = MINIMUM_GAP;
  let lastCall = 0;
  return function () {
    const now = Date.now();
    if (now - lastCall < t) return { executed: true };
    lastCall = now;
    return { executed: true, result: func.apply(this, arguments) };
  };
};
