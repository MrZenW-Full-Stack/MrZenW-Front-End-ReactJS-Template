/**
 * @author MrZenW
 * @email mrzenw@gmail.com, https://mrzenw.com
 * @create date 2021-05-25 13:12:18
 * @modify date 2021-05-25 13:12:19
 * @desc [description]
 */
/* eslint-disable no-use-before-define */

const _btoa = window.btoa;
const _atob = window.atob;

const hasOwnPropertyCall = (caller, arg1) => {
  return Object.prototype.hasOwnProperty.call(caller, arg1);
};

function getDropdownTextValueObject(dropdownContent) {
  let returnVariable = null;
  try {
    const base64 = dropdownContent.slice('b64:'.length);
    returnVariable = JSON.parse(_atob(base64));
    if (!checkIfDropdownTextValueObject(returnVariable)) return null;
  } catch (error) {
    // console.reportError(error, dropdownContent);
    returnVariable = null;
  }
  return returnVariable;
}
exports.getDropdownTextValueObject = getDropdownTextValueObject;

function getDropdownValue(dropdownContent) {
  const returnVariable = getDropdownTextValueObject(dropdownContent);
  if (returnVariable) {
    return returnVariable.value;
  }
  return dropdownContent;
}
exports.getDropdownValue = getDropdownValue;

function getDropdownText(dropdownContent) {
  const returnVariable = getDropdownTextValueObject(dropdownContent);
  if (returnVariable) {
    return returnVariable.text;
  }
  return dropdownContent;
}
exports.getDropdownText = getDropdownText;

function checkIfDropdownTextValueObject(textValueObj) {
  return hasOwnPropertyCall(textValueObj, 'text') && hasOwnPropertyCall(textValueObj, 'value');
}
exports.checkIfDropdownTextValueObject = checkIfDropdownTextValueObject;

function createDropdownTextValueStringify(text, value) {
  return 'b64:' + _btoa(JSON.stringify({ text, value }));
}
exports.createDropdownTextValueStringify = createDropdownTextValueStringify;
