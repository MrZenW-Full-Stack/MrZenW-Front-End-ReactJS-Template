/**
 * @author MrZenW
 * @email MrZenW@gmail.com, https://MrZenW.com
 * @create date 2022-06-02 17:42:53
 * @modify date 2022-06-02 19:49:34
 * @desc [description]
 */

function pathSolve(pathExpression, separator) {
  if (!pathExpression) return '';
  separator = separator || '/';
  // string
  if (typeof pathExpression === 'string') {
    const solvedPath = [];
    const subPathNodeSplitted = pathExpression.split(separator);
    subPathNodeSplitted.forEach((subPathNode) => {
      subPathNode = subPathNode.trim();
      if (!subPathNode) {
        // pass
      } else if (subPathNode === '.') {
        // pass
      } else if (subPathNode === '..') {
        solvedPath.pop();
      } else {
        solvedPath.push(subPathNode);
      }
    });
    return solvedPath.join(separator);
  }
  // array
  if (Array.isArray(pathExpression)) {
    let resovedPathString = '';
    Array.from(pathExpression).forEach((one) => {
      if (one[0] === '/') {
        resovedPathString = pathSolve(one, separator);
      } else {
        resovedPathString = pathSolve(resovedPathString + separator + one, separator);
      }
    });
    return resovedPathString;
  }
  throw new Error('path expression only support string or array type');
}

exports.pathSolve = pathSolve;
