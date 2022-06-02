/**
 * @author MrZenW
 * @email MrZenW@gmail.com, https://MrZenW.com
 * @create date 2021-05-25 13:13:23
 * @modify date 2021-05-25 13:13:24
 * @desc [description]
 */
/* eslint-disable no-unused-vars */

const prototypeToString = Object.prototype.toString;
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray#Polyfill
const ARRAY_TYPE_STRINGIFY = Object.prototype.toString.call([]);
function _isArray(variable) {
  return prototypeToString.call(variable) === ARRAY_TYPE_STRINGIFY;
}

function _arrayCopy(arr) {
  if (_isArray(arr)) return arr.slice(0);
  return [arr];
}
function executor(functionArray, context, idx) {
  idx = idx || 0;
  const func = functionArray[idx];
  if (typeof func === 'function') {
    functionArray[idx] = null;
    func((nextContext) => {
      setTimeout(executor, 0, functionArray, nextContext || context, idx + 1);
    }, context);
  }
}
function exec(functionArray, context) {
  return executor(_arrayCopy(functionArray), context);
}
exports.exec = exec;

function loop(functionArray, context) {
  functionArray = _arrayCopy(functionArray);
  functionArray.push((next, nextContext) => {
    executor(_arrayCopy(functionArray), nextContext);
  });
  return executor(_arrayCopy(functionArray), context);
}
exports.loop = loop;
