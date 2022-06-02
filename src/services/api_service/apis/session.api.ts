/**
 * @author MrZenW
 * @email MrZenW@gmail.com, https://MrZenW.com
 * @create date 2021-10-05 14:58:48
 * @modify date 2021-10-05 14:58:48
 * @desc [description]
 */

import { ApiService, HttpResponse, HttpResponseData } from '../api_service';

export interface SessionDoc {
  _id: string,
  sessionId: string,
  clientId: string,
  [propName: string]: any,
}

export class SessionApiClass {
  apiService: ApiService = null;

  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }
}
