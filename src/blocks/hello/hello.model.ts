import { AwextClass, AwextName, parsePath, UseAwextClass, UseAwextForceUpdate, UseAwextInitFunctionReturn } from '$/awext/core/typescript';

export class HelloModelClass extends UseAwextClass {
  inputArgs: any
  protected _useAwextInit(inputArgs?: any, _useAwextForceUpdate?: UseAwextForceUpdate, awext?: AwextClass): UseAwextInitFunctionReturn {
    this.inputArgs = inputArgs;
    const unwatch = this.awextWatchPath('count', _useAwextForceUpdate);
    return () => {
      unwatch();
    };
  }
  get helloWorldText() {
    return 'Hello, World.';
  }
  set count(newNumber: any) {
    this.awextSetPath('count', parseInt(newNumber, 10) || 0);
  }
  get count(): number {
    return parseInt(this.awextGetPath('count'), 10) || 0;
  }
}
