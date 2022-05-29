/**
 * @author MrZenW
 * @email mrzenw@gmail.com, https://mrzenw.com
 * @create date 2021-05-25 13:21:01
 * @modify date 2021-10-12 14:58:01
 * @desc [description]
 */

const { awextify, getAwext, parsePath } = require('$/awext/core');
const configService = require('$/services/config_service');
const { grabMqttService } = require('$/services/mqtt_service');
const { grabUiService } = require('$/services/ui_service');
const { grabLocalStorageService } = require('$/services/local_storage_service');
const { ApiService } = require('$/services/api_service');
const { grabCommunityTalkPod } = require('$/awext/pods/community_talk_pod');

function communicationParamHitChecker(param, pattern) {
  if (pattern === '*') return true;
  if (pattern instanceof RegExp) return pattern.test(param);
  return pattern === param;
}

exports.fetchSessionService = (sessionId) => {
  return configService.grabSessionApi(sessionId)
    .then((apiResp) => {
      const { sessionDoc } = apiResp.data.payload;
      const sessionService = exports.grabSessionService(sessionDoc.sessionId);
      sessionService.sessionDoc = sessionDoc;
      return sessionService;
    });
};

const serviceStoreRootPath = ['service_awext'];
exports.grabSessionService = (sessionId) => {
  const awextName = [].concat(['session_service'], parsePath(sessionId, '/'));
  let session = getAwext(awextName);
  if (!session) {
    session = awextify({ awextName, bindThisToBase: true }, {
      set sessionDoc(newValue) {
        return this.awextSetPath('sessionDoc', newValue);
      },
      get sessionDoc() {
        return this.awextGetPath('sessionDoc');
      },
      get clientId() {
        return this.sessionDoc.clientId;
      },
      get sessionId() {
        return this.awextGetPath('sessionId') || this.sessionDoc.sessionId;
      },
      get sessionPublicId() {
        return this.sessionDoc.sessionPublicId;
      },
      // various services
      get mqttService() {
        return this.awextGetPath([].concat(serviceStoreRootPath, ['mqttService']));
      },
      get uiService() {
        return this.awextGetPath([].concat(serviceStoreRootPath, ['uiService']));
      },
      get localStorageService() {
        return this.awextGetPath([].concat(serviceStoreRootPath, ['localStorageService']));
      },
      get apiService() {
        return this.awextGetPath([].concat(serviceStoreRootPath, ['apiService']));
      },
      get communityTalkPod() {
        return this.awextGetPath([].concat(serviceStoreRootPath, ['communityTalkPod']));
      },
      sendCommunityTalk(from, to, subject, payload) {
        if (from === '*') throw new Error('The sender\'s name cannot be a "*"');
        if (to === '*') throw new Error('The receiver\'s name cannot be a "*"');
        return this.awextEmit('community_talk', {
          from,
          to,
          subject,
          payload,
        });
      },
      receiveCommunityTalk(from, to, subject, cb) {
        return this.awextOn('community_talk', (_, eventData) => {
          if (communicationParamHitChecker(eventData.from, from)
            && communicationParamHitChecker(eventData.to, to)
            && communicationParamHitChecker(eventData.subject, subject)) {
            cb(_, eventData);
          }
        });
      },
    }, (thisAwext, sessionServiceObject) => {
      thisAwext.awextSetPath('sessionId', sessionId);

      thisAwext.awextSetManyPaths({
        mqttService: grabMqttService(sessionId),
        uiService: grabUiService(sessionId),
        localStorageService: grabLocalStorageService(sessionId),
        apiService: ApiService.grabOne([sessionId]).initialiseIfNeeded({ sessionService: sessionServiceObject }),
        communityTalkPod: grabCommunityTalkPod(sessionId),
      }, serviceStoreRootPath);

      return () => {
        thisAwext.awextRemovePath('sessionId');
        const allServices = thisAwext.awextGetPath(serviceStoreRootPath);
        Object.entries(allServices)
          .forEach((serviceName, serviceAwext) => {
            if (serviceAwext) {
              serviceAwext.awextDiscard();
              const path = [].concat(serviceStoreRootPath, [serviceName]);
              thisAwext.awextRemovePath(path);
            }
          });
      };
    });
  }
  return session;
};
