/**
 * @author MrZenW
 * @email mrzenw@gmail.com, https://mrzenw.com
 * @create date 2021-05-25 13:20:18
 * @modify date 2021-06-04 16:41:00
 * @desc [description]
 */

/* eslint-disable no-alert */
/* eslint-disable no-debugger */

const { awextify } = require('$/awext/core');

exports.devtoolService = awextify({ awextName: 'devtool_service', bindThisToBase: true }, {
  get consoleOpenStatus() {
    return this.awextGetPath('consoleOpenStatus');
  },
  startCheckDevTool() {
    function check() {
      console.clear();
      const before = Date.now();
      debugger;
      if (Date.now() - before > 200) {
        document.write('Dont open DevTool!');
        alert('Dont open DevTool!');
        window.location.replace(window.location.protocol + window.location.href.substring(window.location.protocol.length));
      }
      setTimeout(check, 500);
    }
    check();
  },
}, () => {
  // baseObject.startCheckDevTool();
});
