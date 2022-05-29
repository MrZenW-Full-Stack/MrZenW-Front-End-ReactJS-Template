/**
 * @author MrZenW
 * @email mrzenw@gmail.com, https://mrzenw.com
 * @create date 2021-05-25 13:12:22
 * @modify date 2021-05-25 13:12:23
 * @desc [description]
 */
const _module_ = {
  // Internet Explorer 6-11
  isIE: () => {
    // eslint-disable-next-line
    return /*@cc_on!@*/false || !!document.documentMode;
  },
  // Chrome on iOS
  isChromeOniOS: () => {
    const ua = navigator.userAgent.toLowerCase();
    return (ua.indexOf('CriOS'.toLowerCase()) > -1);
  },
  // Opera 8.0+
  isOpera: () => {
    return (!!window.opr && !!window.opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
  },
  // Firefox 1.0+
  isFirefox: () => {
    return typeof InstallTrigger !== 'undefined';
  },
  // Safari 3.0+ "[object HTMLElementConstructor]"
  isSafari: () => {
    const ua = navigator.userAgent.toLowerCase();
    let isSafari = /constructor/i.test(window.HTMLElement) || ((p) => { return p.toString() === '[object SafariRemoteNotification]'; })(!window['safari'] || (typeof window['safari'] !== 'undefined' && window['safari'].pushNotification));
    isSafari = isSafari || (ua.indexOf('safari') > -1 && ((!_module_.isChromeOniOS()) || (ua.indexOf('chrome') === -1))); // found safari but don't found chrome = safari
    return isSafari;
  },
  isSafariOniOS: () => {
    return _module_.isSafari() && _module_.isiOS();
  },
  // Edge 20+
  isEdge: () => {
    return !_module_.isIE() && !!window.StyleMedia;
  },
  isChrome: () => {
    // Chrome 1 - 79
    let isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
    // Chrome 80+
    isChrome = isChrome || (!!window.chrome && (!!window.chrome.loadTimes || !!window.chrome.csi));
    return isChrome;
  },
  // Edge (based on chromium) detection
  isEdgeChromium: () => {
    return _module_.isChrome() && (navigator.userAgent.indexOf('Edg') !== -1);
  },
  // Blink engine detection
  isBlink: () => {
    return (_module_.isChrome() || _module_.isOpera()) && !!window.CSS;
  },
  isTouchScreenDevice: () => {
    if (('ontouchstart' in window) || (window.DocumentTouch && document instanceof window.DocumentTouch)) {
      return true;
    }

    const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
    const mq = (query) => {
      return window.matchMedia(query).matches;
    };

    // include the 'heartz' as a way to have a non matching MQ to help terminate the join
    // https://git.io/vznFH
    const query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
    return mq(query);
  },

  /**
   * https://stackoverflow.com/questions/3007480/determine-if-user-navigated-from-mobile-safari/29696509#29696509
   * @returns boolean
   */
  isiOS: () => {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('ipad') > -1 || ua.indexOf('iphone') > -1) return true;
    if (_module_.isTouchScreenDevice()) {
      // eslint-disable-next-line no-use-before-define
      if (_module_.isChromeOniOS()) return true;
      if (_module_.isSafari()) return true;
    }
    return false;
  },
  isAndroid: () => {
    return /Android/i.test(navigator.userAgent);
  },
};
module.exports = Object.assign({}, _module_);
