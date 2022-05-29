/**
 * @author MrZenW
 * @email mrzenw@gmail.com, https://mrzenw.com
 * @create date 2021-07-23 15:44:43
 * @modify date 2021-07-23 15:44:43
 * @desc [description]
 */

import {
  parsePath,
  AwextClass, AwextName,
} from '$/awext/core/typescript';
import { UserDoc } from './api_service/apis/user.api';

export class UserServiceClass extends AwextClass {
  private _userDoc: UserDoc = null
  static override grabOne(awextName: AwextName) {
    return super.grabOne([].concat(['UserServiceClass'], parsePath(awextName, '/')));
  }
  override _onInit(userDoc: UserDoc) {
    this._userDoc = userDoc;
  }
  get userDoc(): UserDoc {
    return this._userDoc;
  }
}
