/**
 * @author MrZenW
 * @email mrzenw@gmail.com, https://mrzenw.com
 * @create date 2021-05-25 13:13:06
 * @modify date 2021-06-23 10:08:08
 * @desc [description]
 */
const axios = require('axios');

const Httpif = function (config) {
  config = config || {};
  const headers = Object.assign({ Accept: 'application/json' }, config.headers);
  this._httpClient = axios.create(Object.assign({
    // baseURL: config.baseURL,
    timeout: 7 * 1e3,
  }, config, {
    headers,
  }));
};
Httpif.create = (config) => {
  return new Httpif(config);
};
const pt = Httpif.prototype;
pt.request = function (method, url, searchData, bodyData, config) {
  method = method || 'get';

  const searchParamsObject = new URLSearchParams();

  config = config || {};
  const [splitUrl, searchString] = url.split('?');
  if (searchString) {
    (new URLSearchParams(searchString)).forEach((v, k) => {
      searchParamsObject.append(k, v);
    });
  }

  if (typeof searchData === 'string') {
    (new URLSearchParams(searchData)).forEach((v, k) => {
      searchParamsObject.append(k, v);
    });
  } else {
    Object.entries(searchData || {})
      .forEach(([k, v]) => {
        searchParamsObject.append(k, v);
      });
  }

  let paramSearchString = searchParamsObject.toString();
  if (paramSearchString.length > 0) {
    paramSearchString = '?' + paramSearchString;
  }
  const httpClientOption = {
    method,
    url: splitUrl + paramSearchString,
  };
  if (bodyData) {
    httpClientOption.data = bodyData;
  }
  return this._httpClient.request.call(this._httpClient, Object.assign({}, config, httpClientOption));
};
pt.post = function (url, searchData, bodyData, config) {
  return this.request('post', url, searchData, bodyData, config);
};
pt.get = function (url, searchData, bodyData, config) {
  return this.request('get', url, searchData, bodyData, config);
};
pt.put = function (url, searchData, bodyData, config) {
  return this.request('put', url, searchData, bodyData, config);
};
pt.delete = function (url, searchData, bodyData, config) {
  return this.request('delete', url, searchData, bodyData, config);
};
pt.requestUse = function (cb, errorCallback) {
  this._httpClient.interceptors.request.use(cb, errorCallback);
  return this._httpClient;
};
pt.responseUse = function (cb, errorCallback) {
  this._httpClient.interceptors.response.use(cb, errorCallback);
  return this._httpClient;
};

exports.Httpif = Httpif;
