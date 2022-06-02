/**
 * @author MrZenW
 * @email MrZenW@gmail.com, https://MrZenW.com
 * @create date 2021-05-25 13:20:25
 * @modify date 2021-07-26 15:39:22
 * @desc [description]
 */
const { awextify } = require('$/awext/core');
const eventTargetMonkeyService = require('./event_target_monkey_service');

module.exports = awextify({ awextName: 'keyboard_event_service', bindThisToBase: true }, {
  checkKeyDown(code) {
    code = `${code}`.toLowerCase();
    return !!this.awextGetPath(['downKeys', code]);
  },
  get isShiftDown() {
    const left = this.checkKeyDown('shiftLeft');
    const right = this.checkKeyDown('shiftRight');
    if (left && right) return 'both';
    if (left) return 'left';
    if (right) return 'right';
    return this.checkKeyDown('shiftKey');
  },
  _setKeyDown(keyName, status) {
    if (!keyName) {
      throw new Error('keyName could not be empty');
    }
    if (status !== false) {
      status = true;
    }
    this.awextSetPath(['downKeys', `${keyName}`.toLowerCase()], status);
  },
  keyObserver(event) {
    const { repeat } = event;
    const type = `${event.type}`.toLowerCase();
    if (event.code) {
      if (!repeat && type === 'keydown') {
        this._setKeyDown(event.code, true);
        this.awextEmit(type, event);
      } else if (type === 'keyup') {
        this._setKeyDown(event.code, false);
        this.awextEmit(type, event);
      }
    }
    if (!repeat) {
      ([
        'altKey',
        'ctrlKey',
        'metaKey',
        'shiftKey',
      ]).forEach((keyName) => {
        if (keyName in event) {
          this._setKeyDown(keyName, event[keyName]);
        }
      });
    }
  },
}, (awext, baseObject) => {
  eventTargetMonkeyService.use(baseObject.keyObserver);
  // window.addEventListener('keydown', baseObject.keyObserver, false);
  // window.addEventListener('keyup', baseObject.keyObserver, false);

  const onDocumentVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      Object.keys(awext.awextGetPath(['downKeys']) || {})
        .forEach((key) => {
          baseObject._setKeyDown(key, false);
        });
    }
  };
  window.document.addEventListener('visibilitychange', onDocumentVisibilityChange, false);

  return () => {
    // window.removeEventListener('keydown', baseObject.keyObserver, false);
    // window.removeEventListener('keyup', baseObject.keyObserver, false);
    window.removeEventListener('visibilitychange', onDocumentVisibilityChange, false);
  };
});
