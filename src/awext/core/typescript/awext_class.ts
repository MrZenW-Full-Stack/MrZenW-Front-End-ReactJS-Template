const awextLib = require('../lib/core');

export type AwextName = string|number|Array<string|number>;
export type AwextCreateAwextInit = any;
export type AwextPathParam = null|undefined|unknown|string|number|(Array<string|number>);
export type AwextWatchPathParam = null|undefined|unknown|string|number|RegExp|(Array<string|RegExp|number>);
export type AwextPath = Array<string|number>;
export type AwextUnwatch = (...rest: Array<any>) => any;
export type AwextWatchCallback = (eventName: undefined | null, ...rest: Array<any>) => any;
export type AwextEventCallback = (eventName: string, ...rest: Array<any>) => any;
export type AwextNodeStatus = { value?: any, exists: boolean };
export type AwextUpdateNewStateInfo = { silent?: boolean, value?: any };
export type AwextUpdateFunction = (nodeStatus: AwextNodeStatus) => AwextUpdateNewStateInfo;
export type AwextStateObject = any;
export interface AwextCreateAwextOption {
  awextName?: AwextName,
  unmanageable?: boolean,
  bindThisToBase?: boolean,
}
export interface AwextUpdateEvent {
  path?: AwextPath,
  oldState?: any,
  oldPathState?: any,
  oldPathStateExists?: boolean,
  newState?: any,
  newPathState?: any,
  action: 'update' | 'discard' | 'delete' | 'update',
  method: 'awextUpdate' | 'awextDiscard' | 'awextUpdatePath' | 'awextRemovePath',
}
export interface AwextUpdateOptions {
  silent?: boolean, onlyWhenParentExists?: boolean
}

export class AwextClass {
  private _awextFunctions: any;

  static getAwext(awextName: AwextName): any {
    const instance = awextLib.getAwext(awextName);
    if (instance) return instance as any;
    return instance as any;
  }

  static hasAwext(awextName: AwextName): boolean {
    return awextLib.hasAwext(awextName) as boolean;
  }

  static awextify(_opts?: AwextName|AwextCreateAwextOption, baseObject?: any, init?: AwextCreateAwextInit): any {
    return awextLib.awextify(_opts, baseObject, init) as any;
  }

  static grabOne(_opts?: AwextName|AwextCreateAwextOption, init?: AwextCreateAwextInit): any {
    let opts: AwextCreateAwextOption = {};
    if (Array.isArray(_opts) || ['string', 'number'].indexOf(typeof _opts) > -1) {
      opts.awextName = _opts as AwextName;
    } else {
      opts = _opts as AwextCreateAwextOption;
    }
    // const awextName = [].concat([this.name], awextLib.parsePath(opts.awextName, '/'));
    const awextName = awextLib.parsePath(opts.awextName, '/');
    const existingInstance: any = this.getAwext(awextName);
    if (existingInstance) {
      return existingInstance;
    }
    return new this(Object.assign({}, opts, { awextName }), init);
  }

  constructor(_opts?: AwextName|AwextCreateAwextOption, init?: AwextCreateAwextInit) {
    this._awextFunctions = AwextClass.awextify(_opts, this, init).awextClone();
  }

  private _isInited: boolean = false

  get isInited(): boolean {
    return this._isInited;
  }

  set isInited(newValue: boolean) {
    if (!this._isInited) this._isInited = newValue;
  }

  public initIfNeeded(...rest: any[]): this {
    return this.initialiseIfNeeded(...rest);
  }
  public initialiseIfNeeded(...rest: any[]): this {
    if (!this.isInited) {
      this.isInited = true;
      this._onInit(...rest);
    }
    return this;
  }

  protected _onInit(...rest: any[]): any {
  }

  get awextName(): AwextName {
    return this._awextFunctions.awextGetName() as AwextName;
  }

  awextGetName(): AwextName {
    return this._awextFunctions.awextGetName() as AwextName;
  }

  awextClone(): any {
    return this._awextFunctions.awextClone() as any;
  }

  awextIsDiscarded(): boolean {
    return this._awextFunctions.awextIsDiscarded() as boolean;
  }

  awextDiscard(): void {
    this._awextFunctions.awextDiscard();
  }

  awextRegisterUnwatch(unwatch: AwextUnwatch|Array<AwextUnwatch>): AwextUnwatch {
    return this._awextFunctions.awextRegisterUnwatch(unwatch) as AwextUnwatch;
  }

  awextRegisterUnwatchWithNS(namespace: string, unwatch: AwextUnwatch|Array<AwextUnwatch>): AwextUnwatch {
    return this._awextFunctions.awextRegisterUnwatchWithNS(namespace, unwatch) as AwextUnwatch;
  }

  awextEmit(eventName: string, ...rest: Array<any>): any {
    return this._awextFunctions.awextEmit(eventName, ...rest) as any;
  }

  awextOn(eventName: string, callback: AwextEventCallback): AwextUnwatch {
    return this._awextFunctions.awextOn(eventName, callback) as AwextUnwatch;
  }

  awextGet(): AwextStateObject {
    return this._awextFunctions.awextGet() as AwextStateObject;
  }

  awextSet(value: any): any {
    return this._awextFunctions.awextSet(value) as any;
  }

  awextGetPath(path: AwextPathParam): AwextStateObject {
    return this._awextFunctions.awextGetPath(path) as AwextStateObject;
  }

  awextSetPath(path: AwextPathParam, value: any): any {
    return this._awextFunctions.awextSetPath(path, value) as any;
  }

  awextSetManyPaths(value: any, basePath?: AwextPathParam): any {
    return this._awextFunctions.awextSetManyPaths(value, basePath) as any;
  }

  awextReset(): any {
    return this._awextFunctions.awextReset() as any;
  }

  awextResetPath(path: AwextPathParam, _opts?: AwextUpdateOptions): any {
    return this._awextFunctions.awextResetPath(path, _opts) as any;
  }

  awextReplace(newState: any, _opts?: AwextUpdateOptions): any {
    return this._awextFunctions.awextReplace(newState, _opts) as any;
  }

  awextHasPath(path: AwextPathParam): boolean {
    return this._awextFunctions.awextHasPath(path) as boolean;
  }

  awextUpdate(updater: AwextUpdateFunction, _opts?: AwextUpdateOptions): any {
    return this._awextFunctions.awextUpdate(updater, _opts) as any;
  }

  awextUpdatePath(path: AwextPathParam, updater: AwextUpdateFunction, _opts?: AwextUpdateOptions): any {
    return this._awextFunctions.awextUpdatePath(path, updater, _opts) as any;
  }

  awextRemovePath(path: AwextPathParam, _opts?: AwextUpdateOptions): any {
    return this._awextFunctions.awextRemovePath(path, _opts) as any;
  }

  awextCreateUnwatchId(unwatch: AwextUnwatch): number {
    return this._awextFunctions.awextCreateUnwatchId(unwatch) as number;
  }

  awextUnwatchById(unwatchId: number): any {
    return this._awextFunctions.awextUnwatchById(unwatchId) as any;
  }

  awextWatch(watchCallback: AwextWatchCallback): AwextUnwatch {
    return this._awextFunctions.awextWatch(watchCallback) as AwextUnwatch;
  }

  awextWatchPath(path: AwextWatchPathParam, watchCallback: AwextWatchCallback): AwextUnwatch {
    return this._awextFunctions.awextWatchPath(path, watchCallback) as AwextUnwatch;
  }

  awextWatchPathAfter(path: AwextWatchPathParam, watchCallback: AwextWatchCallback): AwextUnwatch {
    return this._awextFunctions.awextWatchPathAfter(path, watchCallback) as AwextUnwatch;
  }

  awextWatchPathSameOrAfter(path: AwextWatchPathParam, watchCallback: AwextWatchCallback): AwextUnwatch {
    return this._awextFunctions.awextWatchPathSameOrAfter(path, watchCallback) as AwextUnwatch;
  }

  awextWatchPathBefore(path: AwextWatchPathParam, watchCallback: AwextWatchCallback): AwextUnwatch {
    return this._awextFunctions.awextWatchPathBefore(path, watchCallback) as AwextUnwatch;
  }

  awextWatchPathSameOrBefore(path: AwextWatchPathParam, watchCallback: AwextWatchCallback): AwextUnwatch {
    return this._awextFunctions.awextWatchPathSameOrBefore(path, watchCallback) as AwextUnwatch;
  }

  awextUnwatchAll(): any {
    return this._awextFunctions.awextUnwatchAll() as any;
  }

  awextUnwatchWithNS(namespace: string): any {
    return this._awextFunctions.awextUnwatchWithNS(namespace) as any;
  }

  awextUnwatchWithNamespace(namespace: string): any {
    return this._awextFunctions.awextUnwatchWithNamespace(namespace) as any;
  }
}
