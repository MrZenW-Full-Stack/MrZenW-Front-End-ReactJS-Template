/**
 * @author MrZenW
 * @email MrZenW@gmail.com, https://MrZenW.com
 * @create date 2021-05-25 13:20:12
 * @modify date 2021-07-21 12:25:44
 * @desc [description]
 */
const FingerprintJS = require('@fingerprintjs/fingerprintjs');
const { Httpif } = require('$/libraries/httpif');
const { awextify, parsePath } = require('$/awext/core');
const { digest } = require('$/libraries/ezdigest');
const { grabLocalStorageService } = require('./local_storage_service');

const fpPromise = FingerprintJS.load();

const defaultConfig = {
  baseURL: process.env.API_BASE_URL,
  timeout: 5 * 1e3,
  headers: { Accept: 'application/json' },
};
const httpifClient = Httpif.create(defaultConfig);

module.exports = awextify({ awextName: 'config_service', bindThisToBase: true }, {
  CONT__ROBOT_POSITION_SENDING_AND_RECEIVING_TIME_GAP: 1000 / 10,
  get localStorageService() {
    return this.awextGetPath('localStorageService');
  },
  setConfigItem(name, value) {
    const locaStoreKey = parsePath(name, '/').join('/');
    this.localStorageService.setLocalItem(locaStoreKey, value);
    return this.awextSetPath(name, value);
  },
  getConfigItem(name) {
    const localStorageValue = this.localStorageService.getLocalItem(name);
    if (this.awextGetPath(name) !== localStorageValue) {
      this.awextSetPath(name, localStorageValue);
    }
    return localStorageValue;
  },
  async fetchClientInfo() {
    const headers = {};
    const clientId = this.getConfigItem('clientId');
    if (clientId) {
      const zAuth = new URLSearchParams({
        clid: clientId,
      });
      headers['Authorization'] = 'zAuth ' + zAuth.toString();
    }
    const fp = await fpPromise;
    const result = await fp.get();
    const fpDigest = digest(result.visitorId).string;
    const search = {
      fp_digest: fpDigest,
      fp: result.visitorId,
    };
    return httpifClient.get('/client', search, null, { headers })
      .then((res) => {
        const { data: { payload } } = res;
        this.setConfigItem('clientId', payload.clientDoc.clientId);
        return res;
      });
  },

  fetchSessionApi(sessionId) {
    const headers = {};
    const clientId = this.getConfigItem('clientId');
    if (clientId && sessionId) {
      const zAuth = new URLSearchParams({
        clid: clientId,
        sessid: sessionId,
      });
      headers['Authorization'] = 'zAuth ' + zAuth.toString();
    }
    return httpifClient.get('/client/session/session_info', null, null, { headers });
  },
  fetchNewSessionApi() {
    const headers = {};
    const clientId = this.getConfigItem('clientId');
    if (clientId) {
      const zAuth = new URLSearchParams({
        clid: clientId,
      });
      headers['Authorization'] = 'zAuth ' + zAuth.toString();
    }
    return httpifClient.get('/client/session/generate', null, null, { headers });
  },
  grabSessionApi(sessionId) {
    if (sessionId) return this.fetchSessionApi(sessionId);
    return this.fetchNewSessionApi();
  },
  get currentSessionId() {
    return this.getConfigItem('currentSessionId');
  },
  set currentSessionId(sessionId) {
    return this.setConfigItem('currentSessionId', sessionId);
  },
}, (thisAwext) => {
  const localStorageService = grabLocalStorageService('_config_service_');
  thisAwext.awextSetPath('localStorageService', localStorageService);
  return () => {
    localStorageService.awextDiscard();
  };
});
