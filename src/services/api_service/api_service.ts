/**
 * @author MrZenW
 * @email MrZenW@gmail.com, https://MrZenW.com
 * @create date 2021-05-25 13:19:37
 * @modify date 2021-06-17 13:18:58
 * @desc [description]
 */
import {
  parsePath,
  AwextClass, AwextName,
} from '$/awext/core/typescript';
import { RoomApiClass } from './apis/room.api';
import { WorkApiClass } from './apis/work.api';
import { UserApiClass } from './apis/user.api';
import { VerifyApiClass } from './apis/verify.api';
import { SessionApiClass } from './apis/session.api';

const { Httpif } = require('$/libraries/httpif');
const { grabLocalStorageService } = require('$/services/local_storage_service');
const configService = require('$/services/config_service');

export type HttpResponseDataCode = string;
export type HttpResponseDataMessage = string;
export type HttpResponseDataError = string;

export interface HttpResponseData {
  ok: number,
  code: HttpResponseDataCode,
  msg?: HttpResponseDataMessage,
  err?: HttpResponseDataError,
  payload?: any,
  [propName: string]: any,
}
export interface HttpResponse {
  config: any,
  data: HttpResponseData,
  headers: any,
  is2xx: boolean,
  isApiError: boolean,
  error?: any,
  request: any,
  status: number,
  statusText: string,
  [propName: string]: any,
}

function respProcessor(resp: any): HttpResponse {
  const defaultItems: HttpResponse = {
    config: {},
    data: null,
    headers: {},
    is2xx: false,
    isApiError: false,
    request: {},
    status: 0,
    statusText: '',
  };
  Object.assign(defaultItems, resp);
  Object.assign(resp, defaultItems);
  if (resp.isAxiosError) {
    Object.assign(resp, resp.response);
    resp.error = resp;
    resp.isApiError = true;
  }
  const status = parseInt(resp.status + '', 10);
  resp.is2xx = status >= 200 && status < 300;
  return resp as HttpResponse;
}

export class ApiService extends AwextClass {
  sessionService: any = null;

  sessionId: string = null;

  sessionApi: SessionApiClass = null;
  workApi: WorkApiClass = null;
  roomApi: RoomApiClass = null;
  userApi: UserApiClass = null;
  verifyApi: VerifyApiClass = null;

  static override grabOne(awextName: AwextName) {
    return super.grabOne([].concat(['ApiService'], parsePath(awextName, '/')));
  }

  override _onInit(args: { sessionService: any }) {
    this.sessionService = args.sessionService;
    this.sessionId = this.sessionService.sessionId;
    const defaultConfig = {
      baseURL: process.env.API_BASE_URL,
      timeout: 5 * 1e3,
      headers: {
        Accept: 'application/json',
        Authorization: 'zAuth ' + (new URLSearchParams({
          clid: configService.getConfigItem('clientId') || '',
          sessid: this.sessionId,
        })).toString(),
      },
    };
    this.awextSetPath('config', defaultConfig);
    const httpifClient = Httpif.create(defaultConfig);
    httpifClient.requestUse(async (apiClientConfig: any) => {
      const clientId = configService.getConfigItem('clientId');

      const _apiServiceConfig = {
        headers: {},
      };

      const _apiClientConfig = Object.assign({}, apiClientConfig);
      _apiClientConfig.headers = Object.assign({}, _apiClientConfig.headers || {});

      _apiClientConfig.headers = Object.assign({}, _apiClientConfig.headers, _apiServiceConfig.headers);

      const zAuth = new URLSearchParams({
        clid: clientId || '',
        sessid: this.sessionId,
      });
      _apiClientConfig.headers['Authorization'] = 'zAuth ' + zAuth.toString();

      this.awextEmit('http_client_request', {
        pathname: apiClientConfig.url,
        ok: true,
        _apiClientConfig,
        _apiServiceConfig,
      });
      return _apiClientConfig;
    }, (error: any) => {
      this.awextEmit('http_client_request', {
        pathname: error.config.url,
        actionType: 'request',
        ok: false,
        error,
        // apiServiceConfig,
        apiClientConfig: error.config,
      });
      return Promise.reject(error);
    });
    httpifClient.responseUse(
      (resp: any) => {
        const result: HttpResponse = respProcessor(resp);
        const { config } = resp;
        if (config && typeof config.responseUse === 'function') {
          config.responseUse(result);
        }
        return Promise.resolve(result);
      },
      (error: any) => {
        const result: HttpResponse = respProcessor(error);
        console.error(error);
        const { config } = error;
        if (config && typeof config.responseErrorUse === 'function') {
          config.responseErrorUse(result);
          return Promise.reject(result);
        }
        const errorMessage = result.data?.err || result.error?.message;
        if (errorMessage) {
          alertLib.alertError({
            title: 'API ERROR',
            text: errorMessage,
          });
        }
        return Promise.reject(result);
      },
    );
    this.awextSetPath('httpifClient', httpifClient);

    // bind
    this.sessionApi = new SessionApiClass(this);
    this.workApi = new WorkApiClass(this);
    this.roomApi = new RoomApiClass(this);
    this.userApi = new UserApiClass(this);
    this.verifyApi = new VerifyApiClass(this);
  }

  get _localStorageService(): any {
    return grabLocalStorageService(this.sessionId);
  }

  get httpifClient(): any {
    return this.awextGetPath('httpifClient');
  }

  get config(): any {
    return this.awextGetPath('config');
  }

  clientRequest(...rest: any[]): any {
    return this.httpifClient.request.apply(this.httpifClient, rest);
  }

  clientPost(url: string, searchData: any = null, bodyData: any = null, config: any = null): any {
    return this.clientRequest('post', url, searchData, bodyData, config);
  }

  clientGet(url: string, searchData: any = null, bodyData: any = null, config: any = null): any {
    return this.clientRequest('get', url, searchData, bodyData, config);
  }

  clientPut(url: string, searchData: any = null, bodyData: any = null, config: any = null): any {
    return this.clientRequest('put', url, searchData, bodyData, config);
  }

  clientPatch(url: string, searchData: any = null, bodyData: any = null, config: any = null): any {
    return this.clientRequest('patch', url, searchData, bodyData, config);
  }

  clientDelete(url: string, searchData: any = null, bodyData: any = null, config: any = null): any {
    return this.clientRequest('delete', url, searchData, bodyData, config);
  }
}
