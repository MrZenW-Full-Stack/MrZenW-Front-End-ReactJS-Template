/**
 * @author MrZenW
 * @email MrZenW@gmail.com, https://MrZenW.com
 * @create date 2021-05-25 13:09:20
 * @modify date 2022-06-02 22:58:25
 * @desc [description]
 */

const { awextify } = require('$/awext/core');
const { pathSolve } = require('$/libraries/path_lib');

const parseHashPathObject = (hash) => {
  hash = `${hash}`;
  hash = hash.replace(/^#*/g, ''); // trim # on the left
  hash = hash.replace(/\?*$/g, ''); // trim ? on the right
  hash = hash.replace(/\/*$/g, ''); // trim / on the right
  hash = hash || '/';
  const questionMarkIndex = hash.indexOf('?');
  if (questionMarkIndex === -1) { // not found questiong mark
    return {
      hash,
      hashPathname: hash,
      hashSearch: null,
    };
  } else {
    const hashPathname = hash.slice(0, questionMarkIndex);
    const hashSearch = hash.slice(questionMarkIndex);
    return {
      hash,
      hashPathname,
      hashSearch,
    };
  }
};

exports.historyAwext = ((window) => {
  const historyAwext = awextify('historyAwext', {
    goto(data, unused, url) {
      window.history.pushState(data, '', url);
    },
    gotoHash(data, unused, newHash) {
      newHash = `${newHash}`;
      const newHashPathObject = parseHashPathObject(newHash);
      const currentHashPathname = `${this.hashPathname}`;
      const absolutePathname = pathSolve([currentHashPathname, newHashPathObject.hashPathname]);
      this.hash = absolutePathname + newHashPathObject.hashSearch;
      this.goto(data, '', '#' + this.hash);
    },
    get hash() {
      return historyAwext.awextGetPath('hash') || '';
    },
    set hash(newHash) {
      const hashPathObject = parseHashPathObject(newHash);
      // set it in
      historyAwext.awextSetPath('hash', hashPathObject.hash);
      historyAwext.awextSetPath('hashPathname', hashPathObject.hashPathname);
      historyAwext.awextSetPath('hashSearch', hashPathObject.hashSearch);
    },
    get hashPathname() {
      return historyAwext.awextGetPath('hashPathname') || '/';
    },
    get hashSearch() {
      return historyAwext.awextGetPath('hashSearch') || '';
    },
    set currentState(currentState) {
      historyAwext.awextSetPath('currentState', currentState);
    },
    get currentState() {
      return historyAwext.awextGetPath('currentState');
    },
  });
  // hashChangeDetecter
  function emitHashChangeIfNeeded(state) {
    if (historyAwext.hash !== window.location.hash) {
      historyAwext.hash = window.location.hash;
      historyAwext.awextEmit('hashchange', state, '', window.location);
    }
  }
  // event pushState
  window.history.pushState = ((ogPushState) => {
    return function pushState(state, unused, url) {
      const returnV = ogPushState.call(this, state, '', url);
      // const _location = location;
      // historyAwext.awextEmit.apply(historyAwext, [].concat(['pushstate'], args));
      historyAwext.currentState = state;
      historyAwext.awextEmit('pushstate', state, '', window.location);
      emitHashChangeIfNeeded(state);
      return returnV;
    };
  })(window.history.pushState);

  // event popstate
  window.addEventListener('popstate', (event) => {
    historyAwext.currentState = event.state;
    historyAwext.awextEmit('popstate', event.state, '', window.location);
    emitHashChangeIfNeeded(event.state);
  });

  // event hashchange
  window.addEventListener('hashchange', () => {
    emitHashChangeIfNeeded();
    // historyAwext.awextEmit('hashchange', null, '', window.location);
  });

  return historyAwext;
})(window);
