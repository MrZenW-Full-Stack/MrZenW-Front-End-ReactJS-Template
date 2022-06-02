/**
 * @author MrZenW
 * @email MrZenW@gmail.com, https://MrZenW.com
 * @create date 2021-05-25 13:12:31
 * @modify date 2021-07-02 13:29:52
 * @desc [description]
 */

/**
 * @param {number} cellSliceNumber how many slice need to have in R, G or B
 * @param {array} root inner variable
 * @param {number} _depth inner variable
 * @returns array
 */
exports.generateColours = (cellSliceNumber, _root, _depth) => {
  _depth = _depth || 0;
  if (_depth >= 3) return _root;
  _root = _root || ['#'];
  return exports.generateColours(
    cellSliceNumber,
    _root.reduce((acc, curr) => {
      return [].concat(acc, Array(cellSliceNumber).fill('').map((c, idx) => {
        return curr + ('00' + (255 * (idx / (cellSliceNumber - 1))).toString(16)).slice(-2);
      }));
    }, []),
    _depth + 1,
  );
};
