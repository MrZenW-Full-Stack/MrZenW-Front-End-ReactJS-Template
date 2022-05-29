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
  // event pushState
  window.history.pushState = ((ogPushState) => {
    return function pushState(state, unused, url) {
      const returnV = ogPushState.call(this, state, '', url);
      // const _location = location;
      // historyAwext.awextEmit.apply(historyAwext, [].concat(['pushstate'], args));
      historyAwext.awextEmit('pushstate', state, '', window.location);
      return returnV;
    };
  })(window.history.pushState);

  // event popstate
  window.addEventListener('popstate', (event) => {
    historyAwext.awextEmit('popstate', event.state, '', window.location);
  });

  // event hashchange
  window.addEventListener('hashchange', () => {
    historyAwext.awextEmit('hashchange', null, '', window.location);
  });

  return historyAwext;
})(window);
