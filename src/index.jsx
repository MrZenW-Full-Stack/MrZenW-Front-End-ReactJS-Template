/**
 * @author MrZenW
 * @email mrzenw@gmail.com, https://mrzenw.com
 * @create date 2021-05-25 13:21:37
 * @modify date 2021-05-25 13:21:37
 * @desc [description]
 */
// const React = require('react');

__webpack_public_path__ = window.__webpack_public_path__ || '/';

const React = require('react');
const Cookie = require('js-cookie');
const { render } = require('react-dom');
const { GoogleReCaptchaProvider } = require('react-google-recaptcha-v3');
const { init, reportError } = require('./libraries/error_report');
// sentry.io begining
console.reportError = reportError;
init();
// sentry.io end

// https://github.com/microsoft/TypeScript/issues/33128#issue-486675867
window.FontAwesomeConfig = Object.assign(
  window.FontAwesomeConfig || {},
  { autoReplaceSvg: 'nest' },
);

require('$/assets/styles/colours.css?noPostcss');
require('bootstrap/scss/bootstrap.scss');
require('$/assets/styles/all.scss');
require('$/assets/styles/hungry-loader.css?noPostcss');
require('@fortawesome/fontawesome-free/js/fontawesome');
require('@fortawesome/fontawesome-free/js/solid');
require('@fortawesome/fontawesome-free/js/regular');
require('@fortawesome/fontawesome-free/js/brands');
require('animate.css');
require('$/services/devtool_service');
require('$/services/keyboard_event_service');
require('$/services/theme_service');

const img = require('$/assets/images/arrow/arrow-down.png');

const Loading = require('$/components/Loading');
const { SessionContext } = require('$/components/session_context');
// const App = require('./App');
const configService = require('$/services/config_service');
const { fetchSessionService } = require('$/services/session_service');
const { promiseKeeper } = require('$/libraries/promise-keeper');

const { checkMobileDevice } = require('./libraries/check-mobile-device');
const { HelloView } = require('./blocks/hello/hello.view');

const fetchGlobalConfigs = async (sessionService) => {
  const [isToolboxError, toolboxError, toolboxResp] = await promiseKeeper(sessionService.apiService.configApi.getGlobalItem('blockly_toolbox'));
  if (isToolboxError) {
    console.error(toolboxError);
  } else {
    configService.setConfigItem('global/blockly_toolbox', toolboxResp.data.configDoc || {});
  }
};

let rootEmptyElement = null;
const getRootEmptyElement = () => {
  if (!rootEmptyElement) {
    rootEmptyElement = document.createElement('div');
    rootEmptyElement.style.display = 'none';
    document.body.appendChild(rootEmptyElement);
  }
  return rootEmptyElement;
};

(async () => {
  /*
  render(<Loading />, getRootEmptyElement());
  await configService.fetchClientInfo();
  // fetch a session by the sessionId
  let [isSessionError, sessionError, sessionService] = await promiseKeeper(fetchSessionService(configService.currentSessionId));
  if (isSessionError) {
    // create a new session
    alertLib.alertError(sessionError);
    sessionService = await fetchSessionService();
  }
  const zAuthObj = new URLSearchParams({ clid: sessionService.clientId, sessid: sessionService.sessionId });
  Cookie.set('zAuth', zAuthObj.toString(), { expires: 10 * 365 });
  configService.currentSessionId = sessionService.sessionId;

  render(
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.GOOGLE_RECAPTCHA_SITE_KEY}
    >
      <SessionContext.Provider value={{ sessionService, sessionId: sessionService.sessionId }}>
        <div>
          111
        </div>
      </SessionContext.Provider>
    </GoogleReCaptchaProvider>,
    getRootEmptyElement(),
  );
  */
  render(<HelloView />, document.getElementById('react-root'));
})().catch((error) => {
  console.error(error, 'error');
});
