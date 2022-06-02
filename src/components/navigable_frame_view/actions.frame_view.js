/**
 * @author MrZenW
 * @email MrZenW@gmail.com, https://MrZenW.com
 * @create date 2021-05-25 13:10:28
 * @modify date 2021-09-23 10:51:19
 * @desc [description]
 */
/* eslint-disable no-restricted-properties */
const { parsePath } = require('$/awext/core');
const { animateFrame, easeOutQuint, easeInQuint } = require('$/libraries/animate');
const keyboardEventService = require('$/services/keyboard_event_service');

module.exports = {
  _useAwextInit(args) {
    const { props } = args;
    this._mountted = true;
    this.awextSetPath(['viewAwext'], props.initViewAwext);
    // this.currentViewPath = props.currentViewPath;
    this.viewNavigate(props.currentViewPath);
    this.watchCurrentViewPath(() => {
      this.safeForceUpdate();
    });
    this.awextOn('viewNavigate', (_, data) => {
      this._lastAnimation = data.animation;
    });
    return () => {
      this._mountted = false;
    };
  },
  safeForceUpdate() {
    if (this._mountted) {
      this._useAwextForceUpdate();
    }
  },
  _useAwextAfterRender() {
    if (!this.previousViewContainer || !this.currentViewContainer) return;
    const { lastAnimation } = this;
    if ('function' === typeof this._currentAnimateStopper) {
      this._currentAnimateStopper();
    }
    const isShift = keyboardEventService.isShiftDown;
    const duration = isShift ? 3 * 1e3 : 0.3 * 1e3;
    // const duration = 3 * 1e3;
    if (lastAnimation === 'pop') {
      this.previousViewContainer.style.zIndex = 20;
      this.currentViewContainer.style.zIndex = 10;

      this.previousViewContainer.style.transform = 'translate(0px, 0px)';
      // this.currentViewContainer.style.transform = 'translate(-10%, 0px)';

      const currFirstChild = this.currentViewContainer.firstChild;
      const currFirstChildStyle = Object.assign({}, currFirstChild.currentStyle || window.getComputedStyle(currFirstChild));

      const currOriginalWidth = currFirstChild.style.width;
      const currOriginalHeight = currFirstChild.style.height;
      currFirstChild.style.width = currFirstChildStyle.width;
      currFirstChild.style.height = currFirstChildStyle.height;
      this._currentAnimateStopper = animateFrame((p) => {
        if (keyboardEventService.isShiftDown) return;
        const progress = easeInQuint(p);
        const percentage = progress * 100;
        this.previousViewContainer.style.transform = `translate(${percentage}%, 0px)`;
        // const currentViewPercentage = progress * (0 - -10) + -10;
        // this.currentViewContainer.style.transform = `translate(${currentViewPercentage}%, 0px)`;
        if (this.currentViewContainer) {
          this.currentViewContainer.style.width = (progress * 100) + '%';
        }
        if (p === 1) {
          currFirstChild.style.width = currOriginalWidth;
          currFirstChild.style.height = currOriginalHeight;
          this.previousViewAwext = null;
          this.safeForceUpdate();
        }
      }, duration);
    } else if (lastAnimation === 'push') {
      this.previousViewContainer.style.zIndex = 10;
      this.currentViewContainer.style.zIndex = 20;

      this.currentViewContainer.style.transform = 'translate(100%, 0px)';
      this.previousViewContainer.style.transform = 'translate(0px, 0px)';

      const prevFirstChild = this.previousViewContainer.firstChild;
      const prevFirstChildStyle = Object.assign({}, prevFirstChild.currentStyle || window.getComputedStyle(prevFirstChild));

      const prevOriginalWidth = prevFirstChild.style.width;
      const prevOriginalHeight = prevFirstChild.style.height;
      prevFirstChild.style.width = prevFirstChildStyle.width;
      prevFirstChild.style.height = prevFirstChildStyle.height;
      this._currentAnimateStopper = animateFrame((p) => {
        // const isShift = keyboardEventService.isShiftDown;
        // if (isShift) return false;
        const progress = easeOutQuint(p);
        const percentage = (1 - progress) * 100;
        if (this.currentViewContainer) {
          this.currentViewContainer.style.transform = `translate(${percentage}%, 0px)`;
        }
        // const previousViewPercentage = progress * (-10 - 0) + 0;
        // this.previousViewContainer.style.transform = `translate(${previousViewPercentage}%, 0px)`;
        if (this.previousViewContainer) {
          this.previousViewContainer.style.width = ((1 - progress) * 100) + '%';
        }
        if (p === 1) {
          prevFirstChild.style.width = prevOriginalWidth;
          prevFirstChild.style.height = prevOriginalHeight;
          this.previousViewAwext = null;
          this.safeForceUpdate();
        }
      }, duration);
    }
  },
  _receiveCurrentViewContainer(ref) {
    if (ref) {
      this.currentViewContainer = ref;
    }
  },
  _receivePreviousViewContainer(ref) {
    if (ref) {
      this.previousViewContainer = ref;
    }
  },
  get previousViewPath() {
    return Array.from(this.awextGetPath('previousViewPath') || []);
  },
  set previousViewPath(v) {
    return this.awextSetPath('previousViewPath', Array.from(v));
  },
  watchPreviousViewPath(cb) {
    return this.awextWatchPath('previousViewPath', cb);
  },
  get currentViewPath() {
    return Array.from(this.awextGetPath('currentViewPath') || []);
  },
  set currentViewPath(v) {
    return this.awextSetPath('currentViewPath', Array.from(v));
  },
  watchCurrentViewPath(cb) {
    return this.awextWatchPath('currentViewPath', cb);
  },
  get currentViewAwext() {
    const { currentViewPath } = this;
    return this.getViewAwextByPath(currentViewPath);
  },
  getViewAwextByPath(path) {
    return this.awextGetPath(['viewAwext'].concat(
      parsePath(path, '.'),
      ['_awext'],
    ));
  },
  setViewAwextToPath(path, awext) {
    path = ['viewAwext'].concat(parsePath(path, '.'), ['_awext']);
    return this.awextSetPath(path, awext);
  },
  get lastAnimation() {
    const { _lastAnimation } = this;
    this._lastAnimation = null;
    return _lastAnimation;
  },
  viewNavigate(fullPath, awext, opts) {
    opts = opts || {};
    const existingAwext = this.getViewAwextByPath(fullPath);
    if (existingAwext !== awext) {
      if (existingAwext && awext) {
        existingAwext.awextDiscard();
      } else if (!awext) {
        awext = existingAwext;
      }
      if (!awext) throw new Error('Awext not found!');
      this.setViewAwextToPath(fullPath, awext);
      // register discard function
      this.awextRegisterUnwatch(awext.awextDiscard);
    }

    this.previousViewPath = this.currentViewPath;
    this.currentViewPath = fullPath;
    awext.currentPath = fullPath;
    const previousViewAwext = this.getViewAwextByPath(this.previousViewPath);
    awext.currentPath = fullPath;
    if (previousViewAwext) {
      previousViewAwext.currentPath = null;
      this.previousViewAwext = previousViewAwext;
    }
    this.awextEmit('viewNavigate', {
      animation: opts.animation,
      previousViewPath: this.previousViewPath,
      currentViewPath: this.currentViewPath,
    });
  },
};
