import {
  AwextPathParam,
  AwextPath,
} from './awext_class';

const awextLib = require('../lib/core');

export function parsePath(path: AwextPathParam, separator: string): AwextPath {
  return awextLib.parsePath(path, separator) as AwextPath;
}

export function pathGetter(argVar: any, path: AwextPath): any {
  return awextLib.pathGetter(argVar, path);
}
