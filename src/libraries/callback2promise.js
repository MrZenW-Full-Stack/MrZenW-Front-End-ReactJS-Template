module.exports = function (oFunc, bindThis) {
  return function () {
    const self = bindThis || this;
    const args = Array.from(arguments);
    return new Promise((resolve) => {
      args.push(function () {
        const callbackParams = Array.from(arguments);
        resolve(callbackParams);
      });
      oFunc.apply(self, args);
    });
  };
};
