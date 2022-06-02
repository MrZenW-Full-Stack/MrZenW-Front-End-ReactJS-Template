/**
 * @author MrZenW
 * @email MrZenW@gmail.com, https://MrZenW.com
 * @create date 2021-06-15 17:29:29
 * @modify date 2021-06-15 17:29:29
 * @desc [description]
 */
/* eslint-disable no-use-before-define */
import {
  AwextUnwatch,
  AwextClass,
} from './awext_class';

const awextLib = require('../lib/core');

export type UseAwextArgs = any;
export type UseAwextForceUpdate = () => void;
export type UseAwextInitFunctionReturn = void|null|undefined|AwextUnwatch;
export type UseAwextInitFunction = (inputArgs?: UseAwextArgs, _useAwextForceUpdate?: UseAwextForceUpdate, awext?: AwextClass) => UseAwextInitFunctionReturn;
export interface ReactLibrary {
  useState(state: any): Array<any>;
  useEffect(effectFunction: () => void|null|undefined|(() => void), scope?: any): void;
  [propName: string]: any;
}

interface AwextFlag {
  awextObj?: UseAwextClass,
  destroyFunction: any,
  isMounted: boolean,
}

export class UseAwextClass extends AwextClass {
  static useAwext(args: UseAwextArgs, reactLibrary: ReactLibrary): any {
    const { useState, useEffect } = reactLibrary;

    const awextFlag: AwextFlag = useState({
      awextObj: undefined,
      destroyFunction: null,
      isMounted: true,
    } as AwextFlag)[0] as AwextFlag;
    const stateObjectForceUpdateValue = useState(0);
    if (!awextFlag.awextObj) {
      awextFlag.awextObj = new this().initialiseIfNeeded();
      const setForceUpdateValue: (count: string) => void = stateObjectForceUpdateValue[1];
      // bind default functions
      const unoverrideableFuncs = {
        _useAwextForceUpdate: (function () {
          if (awextFlag.isMounted) {
            setForceUpdateValue(awextLib.genUUID());
          } else {
            throw new Error('Cannot render an unmounted component!');
          }
        }),
      };
      awextLib.objectAssign(awextFlag.awextObj, unoverrideableFuncs);
      // END: bind default functions
      const _returnedDestroyFunction = awextFlag.awextObj._useAwextInit(
        args,
        awextFlag.awextObj._useAwextForceUpdate,
        awextFlag.awextObj.awextClone(),
      );
      if (awextLib.isPromise(_returnedDestroyFunction)) {
        throw new Error('The function _useAwextInit can not either be an async function or return a promise!');
      }
      if (!awextLib.isFunction(_returnedDestroyFunction) && !awextLib.isNone(_returnedDestroyFunction)) {
        throw new Error('The function _useAwextInit can only return either a function type variable or a none-like variable!');
      }
      awextFlag.destroyFunction = _returnedDestroyFunction;
    }
    // END: init
    // inputArgs
    awextFlag.awextObj._useAwextReceiveArgs(args);
    awextFlag.awextObj.awextEmit('_useAwextBeforeRender', args);
    awextFlag.awextObj._useAwextBeforeRender(args);

    useEffect(function () {
      // only once on init
      return function () {
        awextFlag.isMounted = false;
        if (awextLib.isFunction(awextFlag.destroyFunction)) {
          awextFlag.destroyFunction(awextFlag.awextObj);
        }
        awextFlag.awextObj.awextDiscard();
      };
    }, []);
    useEffect(function () {
      // every times after render
      awextFlag.awextObj.awextEmit('_useAwextAfterRender', args);
      awextFlag.awextObj._useAwextAfterRender(args);
    });
    return awextFlag.awextObj;
  }

  public isUseAwext = true;

  // constructor(args: UseAwextArgs, useAwextObject: UseAwextClass, reactLib: ReactLibrary) {

  // }

  public useAwextArgs: UseAwextArgs;

  protected _useAwextInit(inputArgs?: UseAwextArgs, _useAwextForceUpdate?: UseAwextForceUpdate, awext?: AwextClass): void|UseAwextInitFunctionReturn {
    return function (): void {};
  }

  protected _useAwextReceiveArgs(inputArgs?: UseAwextArgs): void {
    this.useAwextArgs = inputArgs;
  }

  protected _useAwextForceUpdate(): void {
  }

  protected _useAwextAfterRender(inputArgs?: UseAwextArgs): void {
  }

  protected _useAwextBeforeRender(inputArgs?: UseAwextArgs): void {
  }
}
