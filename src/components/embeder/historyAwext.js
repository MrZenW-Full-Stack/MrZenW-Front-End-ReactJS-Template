/**
 * @author MrZenW
 * @email mrzenw@gmail.com, https://mrzenw.com
 * @create date 2021-05-25 13:09:20
 * @modify date 2021-05-25 13:24:28
 * @desc [description]
 */

const { awextify } = require('$/awext/core');

exports.historyAwext = ((window) => {
  const historyAwext = awextify('historyAwext');
  // hashChangeDetecter
  function hashChangeDetecter() {
    const currentHash = historyAwext.awextGetPath('hash');
    if (currentHash !== window.location.hash) {
      historyAwext.awextSetPath('hash', window.location.hash);
      historyAwext.awextEmit('hashchange', null, '', window.location);
    }
  }
  // event pushState
  window.history.pushState = ((ogPushState) => {
    return function pushState(state, unused, url) {
      const returnV = ogPushState.call(this, state, '', url);
      // const _location = location;
      // historyAwext.awextEmit.apply(historyAwext, [].concat(['pushstate'], args));
      historyAwext.awextEmit('pushstate', state, '', window.location);
      hashChangeDetecter();
      return returnV;
    };
  })(window.history.pushState);

  // event popstate
  window.addEventListener('popstate', (event) => {
    historyAwext.awextEmit('popstate', event.state, '', window.location);
    hashChangeDetecter();
  });

  // event hashchange
  window.addEventListener('hashchange', () => {
    hashChangeDetecter();
    // historyAwext.awextEmit('hashchange', null, '', window.location);
  });

  return historyAwext;
})(window);
