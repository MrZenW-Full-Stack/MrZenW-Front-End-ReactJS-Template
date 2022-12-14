/**
 * @author MrZenW
 * @email MrZenW@gmail.com, https://MrZenW.com
 * @create date 2021-05-25 13:12:45
 * @modify date 2021-05-25 13:12:45
 * @desc [description]
 */
const regExpForEscape = /[.*+\-?^${}()|/[\]\\]/g;
exports.escapeRegExp = (regExp) => {
  // $& means the whole matched string;
  if (regExp instanceof RegExp) regExp = `${regExp.source}`;
  return (`${regExp}`).replace(regExpForEscape, '\\$&');
};
