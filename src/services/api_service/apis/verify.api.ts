/**
 * @author MrZenW
 * @email MrZenW@gmail.com, https://MrZenW.com
 * @create date 2021-09-06 10:00:55
 * @modify date 2021-09-06 10:00:55
 * @desc [description]
 */

import { ApiService, HttpResponse } from '../api_service';

export class VerifyApiClass {
  apiService: ApiService
  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }
  verifyRegisterCode(code: string): Promise<HttpResponse> {
    return this.apiService.clientGet(`/verify/register`, {
      code,
    }) as Promise<HttpResponse>;
  }
}
