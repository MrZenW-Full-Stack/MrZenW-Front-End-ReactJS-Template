/**
 * @author MrZenW
 * @email mrzenw@gmail.com, https://mrzenw.com
 * @create date 2021-05-25 13:21:07
 * @modify date 2021-05-31 17:33:32
 * @desc [description]
 */
const { awextify } = require('$/awext/core');

const themes = ['dark', 'light'];

module.exports = awextify({ awextName: 'theme_service', bindThisToBase: true }, {
  get currentThemeName() {
    return this.awextGetPath('currentThemeName');
  },
  set currentThemeName(newThemeName) {
    newThemeName = `${newThemeName}`.toLowerCase();
    const currentThemeName = (this.currentThemeName + '').toLowerCase();
    if (newThemeName === currentThemeName) return null;
    if (themes.indexOf(newThemeName) === -1) throw new Error('Only support either dark or light!');
    document.body.classList.add(newThemeName + '-theme');
    document.body.classList.remove(currentThemeName + '-theme');
    this.awextSetPath('currentThemeName', newThemeName);
    return newThemeName;
  },
  set isHighContrastStyle(v) {
    return this.awextSetPath('isHighContrastStyle', v);
  },
  get isHighContrastStyle() {
    return this.awextGetPath('isHighContrastStyle');
  },
  get isDarkTheme() {
    return this.currentThemeName === 'dark';
  },
  get isLightTheme() {
    return this.currentThemeName === 'light';
  },
  onThemeChange(cb) {
    return this.awextWatchPath('currentThemeName', () => {
      cb(this.currentThemeName);
    });
  },
}, (awext, baseObject) => {
  const changeFunc = (event) => {
    const isDark = event.matches;
    baseObject.currentThemeName = isDark ? 'dark' : 'light';
  };
  // init
  changeFunc(window.matchMedia('(prefers-color-scheme: dark)'));
  window.matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', changeFunc);

  baseObject.awextWatchPath('isHighContrastStyle', () => {
    if (baseObject.isHighContrastStyle) {
      window.document.body.classList.add('high-contrast-style');
    } else {
      window.document.body.classList.remove('high-contrast-style');
    }
  });
  return () => {
    window.matchMedia('(prefers-color-scheme: dark)')
      .removeEventListener('change', changeFunc);
  };
});
