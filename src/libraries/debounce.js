/**
 * @author MrZenW
 * @email mrzenw@gmail.com, https://mrzenw.com
 * @create date 2021-05-25 13:12:36
 * @modify date 2021-09-03 14:02:44
 * @desc [description]
 */

const DEFAULT_DEBOUNCE_TIME = 0.3 * 1e3;

exports.createDebounce = (fn, time, resultCB) => {
  let timeoutHandle = 0;
  if (typeof resultCB !== 'function') resultCB = (() => {});
  return function wrapperFunction(...args) {
    clearTimeout(timeoutHandle);
    timeoutHandle = setTimeout(() => {
      resultCB(fn.apply(this, args));
    }, time || DEFAULT_DEBOUNCE_TIME);
  };
};

const invokeTimeoutHandleDict = {};
exports.invokeDebounce = (name, fn, time, resultCB) => {
  if (invokeTimeoutHandleDict[name]) clearTimeout(invokeTimeoutHandleDict[name] || 0);
  if (typeof resultCB !== 'function') resultCB = (() => {});
  invokeTimeoutHandleDict[name] = setTimeout(() => {
    delete invokeTimeoutHandleDict[name];
    resultCB(fn());
  }, time || DEFAULT_DEBOUNCE_TIME);
};
