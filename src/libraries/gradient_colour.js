/**
 * @author MrZenW
 * @email MrZenW@gmail.com, https://MrZenW.com
 * @create date 2021-05-25 13:12:49
 * @modify date 2021-07-20 11:16:01
 * @desc [description]
 */
function hex(c) {
  if (Number.isNaN(c)) return '00';
  const s = '0123456789abcdef';
  let i = parseInt(c, 10);
  if (i === 0) return '00';
  i = Math.round(Math.min(Math.max(0, i), 255));
  return s.charAt((i - (i % 16)) / 16) + s.charAt(i % 16);
}

/* Convert an RGB triplet to a hex string */
function convertToHex(rgb) {
  return hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
}

/* Remove '#' in color hex string */
function trim(s) {
  return (s.charAt(0) === '#') ? s.substring(1, 7) : s;
}

/* Convert a hex string to an RGB triplet */
function convertToRGB(hexString) {
  const color = [];
  color[0] = parseInt(trim(hexString).substring(0, 2), 16);
  color[1] = parseInt(trim(hexString).substring(2, 4), 16);
  color[2] = parseInt(trim(hexString).substring(4, 6), 16);
  return color;
}

function generateGradientColour(colorStart, colorEnd, colorCount) {
  // The beginning of your gradient
  const start = convertToRGB(colorStart);
  // The end of your gradient
  const end = convertToRGB(colorEnd);

  // The number of colors to compute
  const len = colorCount || 20;
  const saida = [];

  // Alpha blending amount
  let alpha = 0.0;
  for (let i = 0; i < len; i += 1) {
    const c = [];
    alpha += (1.0 / len);

    c[0] = start[0] * alpha + (1 - alpha) * end[0];
    c[1] = start[1] * alpha + (1 - alpha) * end[1];
    c[2] = start[2] * alpha + (1 - alpha) * end[2];

    saida.unshift(convertToHex(c));
  }
  return saida;
}

exports.generateGradientColour = generateGradientColour;

function gradientCSSLinearGradient(deg, stepNumber, opacity, opt) {
  opt = opt || {};
  const backgroundImageOpacity = opacity || '1';
  // const rgbMax = 255;
  // const rgbMin = 200;
  // const rgbDifference = (rgbMax - rgbMin);

  const rMax = opt.rMax !== undefined ? opt.rMax : 250;
  const rMin = opt.rMin !== undefined ? opt.rMin : 200;
  const rDifference = (rMax - rMin);

  const gMin = opt.gMin !== undefined ? opt.gMin : 240;
  const gMax = opt.gMax !== undefined ? opt.gMax : 255;
  const gDifference = (gMax - gMin);

  const bMin = opt.bMin !== undefined ? opt.bMin : 240;
  const bMax = opt.bMax !== undefined ? opt.bMax : 255;
  const bDifference = (bMax - bMin);
  stepNumber = stepNumber || Math.floor(Math.random() * (30 - 5) + 5);
  const gradient = Array(stepNumber).fill('').map((v, idx, root) => {
    const r = Math.floor(Math.random() * rDifference + rMin);
    const g = Math.floor(Math.random() * gDifference + gMin);
    const b = Math.floor(Math.random() * bDifference + bMin);
    return `rgba(${r},${g},${b},${backgroundImageOpacity}) ${((idx + 1) / root.length) * 100}%`;
  });
  deg = parseInt(deg, 10);
  deg = Number.isNaN(deg) ? Math.floor(Math.random() * 260) : deg;
  return `linear-gradient(${deg}deg, ${gradient.join(',')})`;
}

exports.gradientCSSLinearGradient = gradientCSSLinearGradient;
