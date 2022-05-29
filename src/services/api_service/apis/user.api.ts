/**
 * @author MrZenW
 * @email mrzenw@gmail.com, https://mrzenw.com
 * @create date 2021-07-23 16:18:42
 * @modify date 2021-07-23 16:18:42
 * @desc [description]
 */

import { ApiService, HttpResponse, HttpResponseData } from '../api_service';

export interface UserDoc {
  email: string,
  [propName: string]: any,
}

export interface UserSecurityDoc {
  [propName: string]: any,
}

export interface AdminDoc {
  role: string,
  [propName: string]: any,
}

export interface UserInfoResponseData extends HttpResponseData {
  userDoc: UserDoc,
  userSecurityDoc?: UserSecurityDoc,
  adminDoc?: AdminDoc,
  adminRole?: string,
}

export interface UserInfoResponse extends HttpResponse {
  data: UserInfoResponseData,
}

export interface UserRegistrationData {
  email: string,
  password: string,
  googleReCaptchaToken?: string,
}

export interface UserLoginData {
  email: string,
  password: string,
  googleReCaptchaToken?: string,
}

export class UserApiClass {
  apiService: ApiService = null;
  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }
  getMyUserInfo(): Promise<UserInfoResponse> {
    return this.apiService.clientGet('/user/myDoc') as Promise<UserInfoResponse>;
  }
  registerUser(userRegistrationData: UserRegistrationData): Promise<UserInfoResponse> {
    return this.apiService.clientPost('/user/sign-up', null, userRegistrationData) as Promise<UserInfoResponse>;
  }
  login(userLoginData: UserLoginData): Promise<UserInfoResponse> {
    return this.apiService.clientPost('/user/login', null, userLoginData) as Promise<UserInfoResponse>;
  }
  logout(): Promise<HttpResponse> {
    return this.apiService.clientGet('/user/logout') as Promise<HttpResponse>;
  }
}
