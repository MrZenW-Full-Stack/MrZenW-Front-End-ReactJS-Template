const Sentry = require('@sentry/browser');

const hasWindow = 'undefined' !== typeof window;

let errorReportInited = false;
let isSentryReady = false;

function init() {
  if (errorReportInited) return;
  errorReportInited = true;
  const PRODUCTION_SERVER_TYPE = process.env.PRODUCTION_SERVER_TYPE || 'unknown';
  const isProductionMode = process.env.NODE_ENV === 'production';
  const LIBRARY_READY = (isProductionMode
  && (
    (PRODUCTION_SERVER_TYPE === 'production' && process.env.SENTRY_DSN)
    || (PRODUCTION_SERVER_TYPE !== 'production' && process.env.SENTRY_DSN_TESTING)
  )
  );
  if (LIBRARY_READY) {
    let windowHostname = null;
    let workerType = 'unknown';
    if (hasWindow) {
      windowHostname = window.location.hostname;
      workerType = 'browser_window';
    } else if (process.workerEnv) {
      windowHostname = (new URL(process.workerEnv.WINDOW_LOCATION)).hostname;
      workerType = 'sandbox_worker';
    }

    let isTestingDomain = false;
    let isAssistDomain = false;
    let isAppDomain = false;
    if (windowHostname) {
      // isTestingDomain = /^app-testing\..*/.test(windowHostname);
      // isAssistDomain = /^assist\..*/.test(windowHostname);
      // isAppDomain = /^app\..*/.test(windowHostname);
      isAppDomain = true;
    }
    let configObj = null;
    if (isTestingDomain) {
      configObj = {
        dsn: process.env.SENTRY_DSN_TEST,
        release: `${process.env.APP_VERSION}`,
      };
    } else if (isAppDomain || isAssistDomain) {
      configObj = {
        dsn: process.env.SENTRY_DSN,
        release: `${process.env.APP_VERSION}`,
      };
    }
    if (configObj) {
      configObj.debug = true;
      Sentry.init(configObj);
      isSentryReady = true;
      Sentry.configureScope((scope) => {
        Object.entries({
          worker: workerType,
          BUILD_ENV_OS_HOSTNAME: process.env.BUILD_ENV_OS_HOSTNAME,
          BUILD_ENV_OS_PLATFORM: process.env.BUILD_ENV_OS_PLATFORM,
          BUILD_ENV_OS_TYPE: process.env.BUILD_ENV_OS_TYPE,
          BUILD_DATETIME: process.env.BUILD_DATETIME,
        }).forEach(([key, value]) => {
          scope.setTag(key, value);
        });
      });
    }
  }
}

function _isObject(variable) {
  return 'object' === typeof variable && Object(variable) === variable;
}

const reportError = ((func) => {
  return function () {
    if (!func) return null;
    const originalResult = func.apply(this, arguments);
    if (isSentryReady) {
      const args = Array.from(arguments);
      if (args.length > 1) {
        let opt = args[1];
        if (_isObject(opt)) {
          opt.extra = opt.extra || {};
        } else {
          opt = {
            extra: {
              arg_1: opt,
            },
          };
        }
        opt.extra.arg_0 = opt.extra.arg_0 || 'console.reportError()';
        for (let argI = 2; argI < args.length; argI += 1) {
          opt.extra[`arg_${argI}`] = args[argI];
        }
        args[1] = opt;
      }
      Sentry.captureException.apply(Sentry, args);
    }
    return originalResult;
  };
})(console.error);

function setUserInfo(userInfo) {
  if (isSentryReady) {
    Sentry.configureScope((scope) => {
      scope.setUser(userInfo);
    });
  }
}

exports.init = init;
exports.reportError = reportError;
exports.setUserInfo = setUserInfo;
