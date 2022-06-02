/**
 * @author MrZenW
 * @email MrZenW@gmail.com, https://MrZenW.com
 * @create date 2021-05-25 12:05:31
 * @modify date 2021-10-20 14:27:39
 * @desc [description]
 */
/* eslint-disable no-restricted-properties */
/* eslint-disable no-return-assign */

const DEFAULT_FPS = 120;

const {
  cos,
  sin,
  pow,
  sqrt,
  PI,
} = Math;
/// easings
// https://easings.net/
// sine
exports.easeInSine = (x) => 1 - cos((x * PI) / 2);
exports.easeOutSine = (x) => sin((x * PI) / 2);
exports.easeInOutSine = (x) => -(cos(PI * x) - 1) / 2;
// quad
exports.easeInQuad = (x) => x * x;
exports.easeOutQuad = (x) => 1 - (1 - x) * (1 - x);
exports.easeInOutQuad = (x) => x < 0.5 ? 2 * x * x : 1 - pow(-2 * x + 2, 2) / 2;
// cubic
exports.easeInCubic = (x) => x * x * x;
exports.easeOutCubic = (x) => 1 - pow(1 - x, 3);
exports.easeInOutCubic = (x) => x < 0.5 ? 4 * x * x * x : 1 - pow(-2 * x + 2, 3) / 2;
// quart
exports.easeInQuart = (x) => x * x * x * x;
exports.easeOutQuart = (x) => 1 - pow(1 - x, 4);
exports.easeInOutQuart = (x) => x < 0.5 ? 8 * x * x * x * x : 1 - pow(-2 * x + 2, 4) / 2;
// quint
exports.easeInQuint = (x) => x * x * x * x * x;
exports.easeOutQuint = (x) => 1 - pow(1 - x, 5);
exports.easeInOutQuint = (x) => x < 0.5 ? 16 * x * x * x * x * x : 1 - pow(-2 * x + 2, 5) / 2;
// expo
exports.easeInExpo = (x) => x === 0 ? 0 : pow(2, 10 * x - 10);
exports.easeOutExpo = (x) => x === 1 ? 1 : 1 - pow(2, -10 * x);
exports.easeInOutExpo = (x) => x === 0
  ? 0
  : x === 1
    ? 1
    : x < 0.5 ? pow(2, 20 * x - 10) / 2
      : (2 - pow(2, -20 * x + 10)) / 2;
// cric
exports.easeInCirc = (x) => 1 - sqrt(1 - pow(x, 2));
exports.easeOutCirc = (x) => sqrt(1 - pow(x - 1, 2));
exports.easeInOutCirc = (x) => x < 0.5
  ? (1 - sqrt(1 - pow(2 * x, 2))) / 2
  : (sqrt(1 - pow(-2 * x + 2, 2)) + 1) / 2;
// back
exports.easeInBack = (x) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return c3 * x * x * x - c1 * x * x;
};
exports.easeOutBack = (x) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * pow(x - 1, 3) + c1 * pow(x - 1, 2);
};
exports.easeInOutBack = (x) => {
  const c1 = 1.70158;
  const c2 = c1 * 1.525;
  return x < 0.5
    ? (pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
    : (pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
};
// elastic
exports.easeInElastic = (x) => {
  const c4 = (2 * PI) / 3;

  return x === 0
    ? 0
    : x === 1
      ? 1
      : -pow(2, 10 * x - 10) * sin((x * 10 - 10.75) * c4);
};
exports.easeOutElastic = (x) => {
  const c4 = (2 * PI) / 3;

  return x === 0
    ? 0
    : x === 1
      ? 1
      : pow(2, -10 * x) * sin((x * 10 - 0.75) * c4) + 1;
};
exports.easeInOutElastic = (x) => {
  const c5 = (2 * PI) / 4.5;
  return x === 0
    ? 0
    : x === 1
      ? 1
      : x < 0.5
        ? -(pow(2, 20 * x - 10) * sin((20 * x - 11.125) * c5)) / 2
        : (pow(2, -20 * x + 10) * sin((20 * x - 11.125) * c5)) / 2 + 1;
};
// bounce
exports.easeInBounce = (x) => 1 - exports.easeOutBounce(1 - x);
exports.easeOutBounce = (x) => {
  const n1 = 7.5625;
  const d1 = 2.75;

  if (x < 1 / d1) {
    return n1 * x * x;
  } else if (x < 2 / d1) {
    return n1 * (x -= 1.5 / d1) * x + 0.75;
  } else if (x < 2.5 / d1) {
    return n1 * (x -= 2.25 / d1) * x + 0.9375;
  } else {
    return n1 * (x -= 2.625 / d1) * x + 0.984375;
  }
};
exports.easeInOutBounce = (x) => x < 0.5
  ? (1 - exports.easeOutBounce(1 - 2 * x)) / 2
  : (1 + exports.easeOutBounce(2 * x - 1)) / 2;

let _frameExecutor = null;
if (typeof window !== 'undefined' && 'function' === typeof window.requestAnimationFrame) {
  _frameExecutor = window.requestAnimationFrame;
} else {
  // setTimeout(task, 0, Date.now());
  _frameExecutor = (task) => {
    setTimeout(task, 0, Date.now());
  };
}
/// easings END

exports.animateFrame = (frameCallback, opts) => {
  if (typeof opts === 'number') {
    opts = { duration: opts };
  }
  opts = opts || {};
  let running = true;
  let currentProgress = 0;
  const progressInvoke = ((cp) => {
    if (cp < 0 || cp > 1) {
      running = false;
      return;
    }
    currentProgress = cp;
    if (frameCallback(currentProgress, false, false) === false) {
      running = false;
      frameCallback(currentProgress, false, true); // cancelled
    }
  });
  let { progressControllerRef } = opts;
  if ('function' !== typeof progressControllerRef) {
    progressControllerRef = (progressInvokeFunc) => {
      const isReverse = !!opts.reverse;
      const fps = opts.fps || DEFAULT_FPS;
      const duration = opts.duration || 0.3 * 1e3;
      const fpsGap = opts.interval || (1e3 / fps);
      let start = 0;
      let lastExec = 0;
      const step = () => {
        if (!running) return;
        const currentTimestamp = Date.now();
        start = start || currentTimestamp;
        if ((currentTimestamp - lastExec) >= fpsGap) {
          lastExec = currentTimestamp;
          let elapsed = currentTimestamp - start;
          if (elapsed >= duration) {
            elapsed = duration;
            running = false;
          }
          const p = isReverse ? 1 - (elapsed / duration) : (elapsed / duration);
          progressInvokeFunc(p);
        }
        _frameExecutor(step);
      };
      _frameExecutor(step);
    };
  }
  progressControllerRef(progressInvoke);
  return () => {
    if (running === false) return;
    running = false;
    frameCallback(currentProgress, true, false); // stopped
  };
};

const getProgressBetweenRanges = (cp, ps, pe) => {
  if (ps === pe) return ps;
  return (cp - ps) / (pe - ps);
};

const getDefRangeByPercentage = (p, progressDefArr) => {
  let returnValue = [];
  progressDefArr.sort((a, b) => {
    if (a.progress > b.progress) return 1;
    if (a.progress < b.progress) return -1;
    return 0;
  }).find((curr, idx) => {
    if (idx === 0 && p < curr.progress) {
      returnValue = [
        null,
        curr,
      ];
      // returnValue = null;
      return true;
    }
    if (idx === (progressDefArr.length - 1) && p > curr.progress) {
      returnValue = [
        curr,
        null,
      ];
      // returnValue = null;
      return true;
    }
    const nextItem = progressDefArr[idx + 1];
    if (curr.progress <= p && nextItem && nextItem.progress >= p) {
      returnValue = [
        curr,
        nextItem,
      ];
      return true;
    }
    return false;
  });
  return returnValue;
};

// compose your key frames to be a complicated animation
exports.keyFrame = (progress, context) => {
  const contextArray = [];
  contextArray.push({ progress, context });
  const initContextKeys = Object.keys(context);
  const curryingFunc = (frameCallback, opts) => {
    const progressDefinitions = {};
    contextArray.forEach(({ progress: forEachProgress, context: forEachContext }) => {
      initContextKeys.forEach((key) => {
        if (key in forEachContext) {
          progressDefinitions[key] = progressDefinitions[key] || [];
          progressDefinitions[key].push({
            progress: forEachProgress,
            value: forEachContext[key],
          });
        }
      });
    });
    return exports.animateFrame(function () {
      const args = Array.from(arguments);
      const p = args[0];
      args[0] = {
        progress: p,
        context: Object.entries(progressDefinitions).reduce((acc, [itemName, progressDefArr]) => {
          const range = getDefRangeByPercentage(p, progressDefArr);
          if (range) {
            let [left, right] = range;
            if (right && !left) left = Object.assign({}, right, { progress: 0 });
            if (left && !right) right = Object.assign({}, left, { progress: 1 });
            if (left && right) {
              const percentage = getProgressBetweenRanges(p, left.progress, right.progress);
              acc[itemName] = percentage * (right.value - left.value) + left.value;
            }
          }
          return acc;
        }, {}),
      };
      return frameCallback.apply(this, args);
    }, opts);
  };
  curryingFunc.keyFrame = (newProgress, newContext) => {
    contextArray.push({ progress: newProgress, context: newContext });
    return curryingFunc;
  };
  return curryingFunc;
};

exports.loopFrame = (frameCB, opts) => {
  opts = opts || {};
  const fps = opts.fps || DEFAULT_FPS;
  const fpsGap = opts.interval || (1e3 / fps);
  let lastExec = 0;
  let running = true;
  let frameNumber = 0;
  const step = (currentTimestamp) => {
    if ((currentTimestamp - lastExec) >= fpsGap) {
      lastExec = currentTimestamp;
      frameNumber += 1;
      frameCB(frameNumber, !running);
    }
    if (running) {
      _frameExecutor(step);
    }
  };
  _frameExecutor(step);
  return () => {
    running = false;
  };
};

// similar to setTimeout
const nextFrameTimeoutStore = {};
let nextFrameTimeoutCounter = 1;
exports.setNextFrameTimeout = function (cb, ms) {
  const startAt = Date.now();
  const args = Array.from(arguments);
  nextFrameTimeoutCounter += 1;
  const currentId = nextFrameTimeoutCounter;
  const stopFunc = exports.loopFrame(() => {
    if (Date.now() - startAt >= ms) {
      stopFunc();
      cb.apply(null, args.slice(2));
    }
  });
  nextFrameTimeoutStore[currentId] = stopFunc;
  return currentId;
};
exports.clearNextFrameTimeout = (timeoutId) => {
  if (nextFrameTimeoutStore[timeoutId]) {
    nextFrameTimeoutStore[timeoutId]();
    delete nextFrameTimeoutStore[timeoutId];
  }
};
