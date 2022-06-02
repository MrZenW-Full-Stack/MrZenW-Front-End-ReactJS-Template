/**
 * @author MrZenW
 * @email MrZenW@gmail.com, https://MrZenW.com
 * @create date 2021-05-25 13:20:36
 * @modify date 2021-06-04 16:41:20
 * @desc [description]
 */
const { awextify, getAwext, parsePath } = require('$/awext/core');

exports.grabLocalStorageService = (storageNamespace) => {
  storageNamespace = parsePath(storageNamespace, '/');
  const awextName = [].concat(['local_storage_service'], storageNamespace);
  const instance = getAwext(awextName);
  if (instance) return instance;
  return awextify({ awextName, bindThisToBase: true }, {
    getLocalSessionItem(key) {
      key = parsePath(key, '/');
      return this.awextGetPath([].concat(['localSession'], key));
    },
    popLocalSessionItem(key) {
      const value = this.getLocalSessionItem(key);
      this.removeLocalSessionItem(key);
      return value;
    },
    setLocalSessionItem(key, value) {
      key = parsePath(key, '/');
      const concatKey = [].concat(['localSession'], key);
      if (value === undefined) {
        this.awextRemovePath(concatKey);
      } else {
        this.awextSetPath(concatKey, value);
      }
      this.awextEmit('localSession_item_change', key, value);
    },
    setLocalSessionItems(content) {
      Object.keys(content).forEach((key) => {
        this.setLocalSessionItem(key, content[key]);
      });
    },
    removeLocalSessionItem(key) {
      return this.setLocalSessionItem(key, undefined);
    },
    // local
    getLocalItem(key) {
      key = parsePath(key, '/');
      return this.awextGetPath([].concat(['local'], key));
    },
    popLocalItem(key) {
      const value = this.getLocalItem(key);
      this.removeLocalItem(key);
      return value;
    },
    setLocalItem(key, value) {
      key = parsePath(key, '/');
      const concatKey = [].concat(['local'], key);
      if (value === undefined) {
        this.awextRemovePath(concatKey);
      } else {
        this.awextSetPath(concatKey, value);
      }
      this.awextEmit('local_item_change', key, value);
    },
    setLocalItems(content) {
      Object.keys(content).forEach((key) => {
        this.setLocalItem(key, content[key]);
      });
    },
    removeLocalItem(key) {
      return this.setLocalItem(key, undefined);
    },
  }, (thisAwext, baseObject) => {
    const keyPrefixArray = storageNamespace;
    const keyPrefix = keyPrefixArray.join('/') + '/';
    // init local
    const localStoreAllKeys = Object.keys(localStorage);
    localStoreAllKeys.forEach((itemKey) => {
      if (itemKey.startsWith(keyPrefix)) {
        const pureKey = itemKey.slice(keyPrefix.length);
        let content = localStorage[itemKey];
        try {
          const contentJSON = JSON.parse(content);
          content = contentJSON;
        } catch (error) {
          //
        }
        baseObject.setLocalItem(pureKey, content);
      }
    });
    // init local session
    const localSessionStoreAllKeys = Object.keys(sessionStorage);
    localSessionStoreAllKeys.forEach((itemKey) => {
      if (itemKey.startsWith(keyPrefix)) {
        const pureKey = itemKey.slice(keyPrefix.length);
        baseObject.setLocalSessionItem(pureKey, sessionStorage[itemKey]);
      }
    });
    const unwatchers = [
      thisAwext.awextOn('local_item_change', (_, key, value) => {
        const fullKey = [].concat(keyPrefixArray, key);
        if (value === undefined) {
          localStorage.removeItem(fullKey.join('/'));
          return;
        }
        let valueString = value;
        if (typeof value !== 'string') {
          valueString = JSON.stringify(value);
        }
        localStorage.setItem(fullKey.join('/'), valueString);
      }),
      thisAwext.awextOn('localSession_item_change', (_, key, value) => {
        const fullKey = [].concat(keyPrefixArray, key);
        if (value === undefined) {
          localStorage.removeItem(fullKey.join('/'));
          return;
        }
        let valueString = value;
        if (typeof value !== 'string') {
          valueString = JSON.stringify(value);
        }
        sessionStorage.setItem(fullKey.join('/'), valueString);
      }),
    ];
    return () => {
      while (unwatchers.length) unwatchers.pop()();
    };
  });
};
