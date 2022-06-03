/**
 * @author MrZenW
 * @email MrZenW@gmail.com, https://MrZenW.com
 * @create date 2021-05-25 13:09:20
 * @modify date 2022-06-03 22:33:22
 * @desc [description]
 */

const { awextify } = require('$/awext/core');
const { pathSolve } = require('$/libraries/path_lib');

const parseHashPathObject = (hash) => {
  hash = `${hash || ''}`;
  hash = hash.replace(/^#*/g, ''); // trim # on the left
  hash = hash.replace(/\?*$/g, ''); // trim ? on the right
  hash = hash.replace(/\/*$/g, ''); // trim / on the right
  hash = hash || '/';
  const questionMarkIndex = hash.indexOf('?');
  if (questionMarkIndex === -1) { // not found questiong mark
    return {
      hash,
      hashPathname: hash,
      hashSearch: '',
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
  const historyAwext = awextify({ awextName: 'historyAwext', bindThisToBase: true }, {
    goto(data, unused, url) {
      window.history.pushState(data, '', url);
    },
    gotoHash(data, unused, newHash) {
      newHash = `${newHash}`;
      const newHashPathObject = parseHashPathObject(newHash);
      const currentHashPathname = `${this.hashPathname}`;
      let absolutePathname = pathSolve([currentHashPathname, newHashPathObject.hashPathname]);
      absolutePathname = absolutePathname.replace(/^\/*/g, '');
      absolutePathname = absolutePathname.replace(/\/*$/g, '');
      const hash = '/' + absolutePathname + newHashPathObject.hashSearch;
      this.hash = hash;
      this.goto(data, '', '#' + this.hash);
    },
    get hash() {
      return this.awextGetPath('hash') || '';
    },
    set hash(newHash) {
      const hashPathObject = parseHashPathObject(newHash);
      // set it in
      this.awextSetPath('hash', hashPathObject.hash);
      this.awextSetPath('hashPathname', hashPathObject.hashPathname);
      this.awextSetPath('hashSearch', hashPathObject.hashSearch);
    },
    get hashPathname() {
      return this.awextGetPath('hashPathname') || '/';
    },
    get hashSearch() {
      return this.awextGetPath('hashSearch') || '';
    },
    set currentState(currentState) {
      this.awextSetPath('currentState', currentState);
    },
    get currentState() {
      return this.awextGetPath('currentState');
    },
  });

  // init
  historyAwext.hash = window.location.hash;

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
    historyAwext.currentState = undefined;
    emitHashChangeIfNeeded();
    // historyAwext.awextEmit('hashchange', null, '', window.location);
  });

  return historyAwext;
})(window);
