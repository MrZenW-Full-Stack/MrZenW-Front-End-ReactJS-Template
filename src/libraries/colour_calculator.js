/**
 * @author MrZenW
 * @email MrZenW@gmail.com, https://MrZenW.com
 * @create date 2021-05-25 13:12:27
 * @modify date 2021-06-11 15:15:53
 * @desc [description]
 */
/* eslint-disable operator-assignment */
// const debug = debugLib(import.meta.url);

exports.colourHex2rgb = (hex) => {
  const rgbHex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return [parseInt(rgbHex[1], 16), parseInt(rgbHex[2], 16), parseInt(rgbHex[3], 16)];
};

const componentToHex = (c) => {
  if (c > 255) return 'ff';
  if (c < 0) return '00';
  const hex = c.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
};
exports.rgb2colourHex = (rgbArray) => {
  return '#' + componentToHex(rgbArray[0]) + componentToHex(rgbArray[1]) + componentToHex(rgbArray[2]);
};

exports.colourCalculator = (colourHex, oprationArray) => {
  oprationArray = oprationArray || [];
  if (oprationArray.length === 0) return colourHex;
  const rgb = exports.colourHex2rgb(colourHex);
  oprationArray.forEach((one) => {
    const colourName = one[0];
    let colourIndex;
    if (colourName === 'r') {
      colourIndex = 0;
    } else if (colourName === 'g') {
      colourIndex = 1;
    } else if (colourName === 'b') {
      colourIndex = 2;
    } else {
      return;
    }
    const opcode = one[1];
    const [, num] = one.split(opcode);
    const isPercentage = (num + '').endsWith('%');
    const n = parseFloat(num) || 0;
    if (opcode === '+') {
      if (isPercentage) {
        rgb[colourIndex] += (rgb[colourIndex] * (n / 100));
      } else {
        rgb[colourIndex] += n;
      }
    } else if (opcode === '-') {
      if (isPercentage) {
        rgb[colourIndex] -= (rgb[colourIndex] * (n / 100));
      } else {
        rgb[colourIndex] -= n;
      }
    }
    rgb[colourIndex] = (rgb[colourIndex] | 0);
  });
  return exports.rgb2colourHex(rgb);
};

exports.getObviousColourBy = (colourHex) => {
  const rgb = exports.colourHex2rgb(colourHex).map((one) => {
    if (one < 128) return one + 128;
    if (one >= 128) return one - 128;
    return one;
  });
  return exports.rgb2colourHex(rgb);
};
