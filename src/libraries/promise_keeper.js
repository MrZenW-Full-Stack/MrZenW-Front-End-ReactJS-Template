/**
 * @author MrZenW
 * @email mrzenw@gmail.com, https://mrzenw.com
 * @create date 2021-06-23 10:54:25
 * @modify date 2021-08-04 11:58:55
 * @desc [description]
 */

const oError = console.error;

exports.promiseKeeper = (promiseObject, timeout) => {
  timeout = timeout || 0;
  return new Promise((resolve) => {
    let isFulfilled = false;
    let timeoutHandle = 0;
    const fulfill = () => {
      if (!isFulfilled) {
        isFulfilled = true;
        if (timeoutHandle) clearTimeout(timeoutHandle);
        return true;
      }
      return false;
    };
    if (timeout) {
      timeoutHandle = setTimeout(() => {
        if (fulfill()) {
          resolve(['timeout', new Error('Timeout'), undefined]);
        }
      }, timeout);
    }
    promiseObject.then((result) => {
      if (fulfill()) {
        resolve([false, undefined, result]);
      }
    }).catch((err) => {
      oError.call(console, err);
      if (fulfill()) {
        resolve([true, err, undefined]);
      }
    });
  });
};
