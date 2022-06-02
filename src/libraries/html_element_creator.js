/**
 * @author MrZenW
 * @email MrZenW@gmail.com, https://MrZenW.com
 * @create date 2021-05-25 13:12:59
 * @modify date 2021-08-04 15:25:30
 * @desc [description]
 */
exports.createElement = (htmlString) => {
  const topDiv = document.createElement('div');
  topDiv.innerHTML = htmlString.trim();
  if (topDiv.childNodes && topDiv.childNodes.length > 1) {
    return topDiv.childNodes;
  }
  return topDiv.firstChild;
};
