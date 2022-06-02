/**
 * @author MrZenW
 * @email MrZenW@gmail.com, https://MrZenW.com
 * @create date 2021-07-19 11:10:00
 * @modify date 2021-07-19 14:30:10
 * @desc [description]
 */
const { nanoid } = require('nanoid');
const { awextify, parsePath, getAwext } = require('$/awext/core');

exports.grabZIndexManagerService = (awextPath) => {
  awextPath = [].concat(['z-index-manager-service'], parsePath(awextPath, '/'));
  const existing = getAwext(awextPath);
  if (existing) return existing;
  return awextify({ awextName: awextPath, bineThisToBase: true }, {
    _currentMaxZIndex: 100,
    _currentMaxManagementId: null,
    _minIndex: 100,
    get currentMaxZIndex() {
      return this._currentMaxZIndex;
    },
    get currentMaxManagementId() {
      return this._currentMaxManagementId;
    },
    initManagement(managementId) {
      managementId = managementId || nanoid();
      let zIndexData = this._getZIndexData(managementId);
      if (!zIndexData) {
        this._setZIndexData(managementId, null, {
          managementId,
          zIndex: this._minIndex,
        });
        zIndexData = this._getZIndexData(managementId);
      }
      return Object.assign({}, zIndexData);
    },
    setMinIndex(n) {
      if (this._minIndex !== n) {
        this._minIndex = n;
        this._reorderAllZIndex();
      }
    },
    _setZIndexData(managementId, path, value) {
      if (!managementId) throw new Error('managementId need to be specified!');
      const fullPath = [].concat(['zindexes'], [managementId], parsePath(path, '.'));
      if (!path && !value) {
        this.awextRemovePath(fullPath);
      } else {
        this.awextSetPath(fullPath, value);
      }
    },
    _getZIndexData(managementId, path) {
      if (!managementId) throw new Error('"managementId" need to be specified!');
      const fullPath = [].concat(['zindexes'], [managementId], parsePath(path, '.'));
      return this.awextGetPath(fullPath);
    },
    getZIndex(managementId) {
      return this._getZIndexData(managementId, 'zIndex');
    },
    setZIndex(managementId, newIndex) {
      const zIndexData = this._getZIndexData(managementId, null);
      const oldZIndex = zIndexData.zIndex;
      newIndex = parseInt(newIndex, 10);
      this._setZIndexData(managementId, 'zIndex', newIndex);
      const newZIndexData = this._getZIndexData(managementId, null);
      if (newIndex >= this._currentMaxZIndex) {
        this._currentMaxZIndex = newIndex;
        this._currentMaxManagementId = managementId;
      }
      const eventData = {
        action: 'setzindex',
        managementId,
        zIndex: newZIndexData.zIndex,
        oldZIndex,
        currentMaxZIndex: this._currentMaxZIndex,
      };
      this.awextEmit('zindexchanged', eventData);
      return eventData;
    },
    goTop(managementId) {
      let zIndexData = this.initManagement(managementId);
      // if (!zIndexData) throw new Error('Cannot find management information by the management id: ' + managementId);
      const oldZIndex = zIndexData.zIndex;
      this._currentMaxZIndex += 1;
      const currentMaxZIndex = this._currentMaxZIndex;
      this._currentMaxManagementId = managementId;
      this._setZIndexData(managementId, 'zIndex', currentMaxZIndex);
      const newZIndexData = this._getZIndexData(managementId, null);
      const eventData = {
        action: 'gotop',
        managementId,
        zIndex: newZIndexData.zIndex,
        oldZIndex,
        currentMaxZIndex,
      };
      this.awextEmit('zindexchanged', eventData);
      return eventData;
    },
    onZIndexChanged(cb) {
      return this.awextOn('zindexchanged', cb);
    },
    deleteManagementId(managementId) {
      this._setZIndexData(managementId, null, null);
      this.awextEmit('deletemanagementid', managementId);
    },
  });
};
