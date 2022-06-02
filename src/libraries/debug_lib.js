/**
 * @author MrZenW
 * @email MrZenW@gmail.com, https://MrZenW.com
 * @create date 2021-05-25 13:12:41
 * @modify date 2021-05-31 13:23:49
 * @desc [description]
 */
/* eslint-disable no-extra-bind */
let logFilter = '';
const readFilterSettings = () => {
  logFilter = `${localStorage.getItem('solo_debug')}`.trim();
};
readFilterSettings();

const originalLog = console.log;
const originalInfo = console.info.bind(console);
const originalWarn = console.warn.bind(console);
const originalError = console.error.bind(console);

const textColour = [
  '#0000CC',
  '#0000FF',
  '#0033CC',
  '#0033FF',
  '#0066CC',
  '#0066FF',
  '#0099CC',
  '#0099FF',
  '#00CC00',
  '#00CC33',
  '#00CC66',
  '#00CC99',
  '#00CCCC',
  '#00CCFF',
  '#3300CC',
  '#3300FF',
  '#3333CC',
  '#3333FF',
  '#3366CC',
  '#3366FF',
  '#3399CC',
  '#3399FF',
  '#33CC00',
  '#33CC33',
  '#33CC66',
  '#33CC99',
  '#33CCCC',
  '#33CCFF',
  '#6600CC',
  '#6600FF',
  '#6633CC',
  '#6633FF',
  '#66CC00',
  '#66CC33',
  '#9900CC',
  '#9900FF',
  '#9933CC',
  '#9933FF',
  '#99CC00',
  '#99CC33',
  '#CC0000',
  '#CC0033',
  '#CC0066',
  '#CC0099',
  '#CC00CC',
  '#CC00FF',
  '#CC3300',
  '#CC3333',
  '#CC3366',
  '#CC3399',
  '#CC33CC',
  '#CC33FF',
  '#CC6600',
  '#CC6633',
  '#CC9900',
  '#CC9933',
  '#CCCC00',
  '#CCCC33',
  '#FF0000',
  '#FF0033',
  '#FF0066',
  '#FF0099',
  '#FF00CC',
  '#FF00FF',
  '#FF3300',
  '#FF3333',
  '#FF3366',
  '#FF3399',
  '#FF33CC',
  '#FF33FF',
  '#FF6600',
  '#FF6633',
  '#FF9900',
  '#FF9933',
  '#FFCC00',
  '#FFCC33',
];

module.exports = (fileFullName, namespace) => {
  const filePathName = fileFullName.replace(/.*\/src\//, '');
  if (!logFilter) {
    return {
      log: (() => {}),
      info: (() => {}),
      warn: (() => {}),
      error: (() => {}),
    };
  }
  namespace = namespace || 'solo';
  if (`${namespace}:${filePathName}`.startsWith(logFilter)) {
    const colourIdx = Math.random() * textColour.length | 0;
    const factory = (originalFunction) => {
      return function () {
        const args = Array.from(arguments);
        const stackArray = (new Error()).stack.split(/\s*?at\s*/g).slice(1, 3);
        args.unshift(`${stackArray.join('\n')}\n[${filePathName}]\n\n`);
        args.unshift(`color: ${textColour[colourIdx]}; background: white; font-size: 1.2em;`);
        args.unshift('%c%s');
        return originalFunction.apply(console, args);
      };
    };
    return {
      log: factory(originalLog),
      info: factory(originalInfo),
      warn: factory(originalWarn),
      error: factory(originalError),
    };
  } else {
    return {
      log: (() => {}),
      info: (() => {}),
      warn: (() => {}),
      error: (() => {}),
    };
  }
};
