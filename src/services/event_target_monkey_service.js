/**
 * @author MrZenW
 * @email mrzenw@gmail.com, https://mrzenw.com
 * @create date 2021-06-29 10:47:04
 * @modify date 2021-06-30 10:05:08
 * @desc [description]
 */
const { awextify } = require('$/awext/core');

module.exports = awextify({ awextName: 'event_target_monkey_service', bindThisToBase: true }, {
  listeners: {},
  _middlewares: [],
  use(ware) {
    if (typeof ware !== 'function') throw new Error('The only parameter must be a function');
    this._middlewares.push(ware);
  },
}, (awext, baseObject) => {
  const _originalAddEventListener = EventTarget.prototype.addEventListener;
  const _originalRemoveEventListener = EventTarget.prototype.removeEventListener;
  EventTarget.prototype.addEventListener = ((func) => {
    return function (eventName, callback) {
      baseObject.listeners[eventName] = baseObject.listeners[eventName] || [];

      const args = Array.from(arguments);
      args[1] = function () {
        baseObject._middlewares.forEach((ware) => {
          ware.apply(this, arguments);
        });
        baseObject.awextEmit.apply(baseObject, [].concat([eventName], Array.from(arguments)));
        return callback.apply(this, arguments);
      };
      // push to the manager
      baseObject.listeners[eventName].push({
        monkey: args[1],
        orig: callback,
      });
      return func.apply(this, args);
    };
  })(EventTarget.prototype.addEventListener);

  EventTarget.prototype.removeEventListener = ((func) => {
    return function (eventName, callback) {
      const args = Array.from(arguments);
      const listeners = baseObject.listeners[eventName] || [];
      for (let idx = 0; idx < listeners.length; idx += 1) {
        const { monkey, orig } = listeners[idx];
        if (orig === callback) {
          listeners.splice(idx, 1);
          args[1] = monkey;
          return func.apply(this, args);
        }
      }
      return func.apply(this, args);
    };
  })(EventTarget.prototype.removeEventListener);

  return () => {
    EventTarget.prototype.addEventListener = _originalAddEventListener;
    EventTarget.prototype.removeEventListener = _originalRemoveEventListener;
  };
});
