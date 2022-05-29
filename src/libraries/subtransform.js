/**
 * @author MrZenW
 * @email mrzenw@gmail.com, https://mrzenw.com
 * @create date 2021-05-25 10:32:14
 * @modify date 2021-05-27 11:58:50
 * @desc This library is used for oprate the children variables of the transform in css
 */

const exclusiveKeyList = [
  'none',
  'initial',
  'inherit',
];

const subtransformKeyList = [
  'matrix',
  'matrix3d',
  'translate',
  'translate3d',
  'translateX',
  'translateY',
  'translateZ',
  'scale',
  'scale3d',
  'scaleX',
  'scaleY',
  'scaleZ',
  'rotate',
  'rotate3d',
  'rotateX',
  'rotateY',
  'rotateZ',
  'skew',
  'skewX',
  'skewY',
  'perspective',
];

exports.change = (currentTransform, itemName, itemValue) => {
  currentTransform += '';
  if (exclusiveKeyList.indexOf(itemName) !== -1) {
    return itemName;
  }
  const itemIndex = currentTransform.indexOf(itemName);
  if (itemIndex === -1) {
    if (itemValue === null) return currentTransform;
    return currentTransform + ' ' + itemName + '(' + itemValue + ')';
  } else {
    const regExp = RegExp(subtransformKeyList.join('|'), 'gi');
    let lastMatched = null;
    const afterItemName = currentTransform.slice(itemIndex + itemName.length);
    lastMatched = regExp.exec(afterItemName);
    let itemEndIndex = currentTransform.length;
    if (lastMatched) {
      itemEndIndex = lastMatched.index;
    }
    const left = currentTransform.slice(0, itemIndex);
    const right = afterItemName.slice(itemEndIndex);
    const result = itemValue === null ? '' : ' ' + itemName + '(' + itemValue + ') ';
    return [
      left,
      result,
      right,
    ].join('');
  }
};

exports.changeElement = (htmlElement, itemName, itemValue) => {
  if (typeof itemName !== 'object' || itemName !== Object(itemName)) {
    itemName = {
      [itemName]: itemValue,
    };
  }
  let originalTransform = htmlElement.style.transform || '';
  Object.entries(itemName).forEach(([key, value]) => {
    originalTransform = exports.change(originalTransform, key, value);
  });
  htmlElement.style.transform = originalTransform;
  return htmlElement;
};
