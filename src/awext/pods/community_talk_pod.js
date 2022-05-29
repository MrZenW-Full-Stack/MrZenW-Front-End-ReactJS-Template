const { awextify, getAwext, parsePath } = require('$/awext/core');
const sysendHelper = require('$/libraries/sysendHelper');

function communityTalkParamHitChecker(param, pattern) {
  if (pattern === '*') return true;
  if (pattern instanceof RegExp) return pattern.test(param);
  return pattern === param;
}

exports.grabCommunityTalkPod = (podName) => {
  podName = parsePath(podName, '/');
  const podNameString = podName.join('/');
  const awextName = [].concat(['community_talk_pod'], podName);
  return getAwext(awextName) || awextify({ awextName, bindThisToBase: true }, {
    sendTalk(from, to, subject, payload) {
      if (from === '*') throw new Error('The sender\'s name cannot be a "*"');
      if (to === '*') throw new Error('The receiver\'s name cannot be a "*"');
      return this.awextEmit('community_talk', {
        channel: podNameString,
        from,
        to,
        subject,
        payload,
      });
    },
    receiveTalk(from, to, subject, cb) {
      return this.awextOn('community_talk', (_, eventData) => {
        if (eventData.channel === podNameString
          && communityTalkParamHitChecker(eventData.from, from)
          && communityTalkParamHitChecker(eventData.to, to)
          && communityTalkParamHitChecker(eventData.subject, subject)) {
          cb(_, eventData);
        }
      });
    },
    sendCrossTalk(from, to, subject, payload) {
      if (from === '*') throw new Error('The sender\'s name cannot be a "*"');
      if (to === '*') throw new Error('The receiver\'s name cannot be a "*"');
      return sysendHelper.broadcastSend(podNameString, {
        channel: podNameString,
        from,
        to,
        subject,
        payload,
      });
    },
    receiveCrossTalk(from, to, subject, cb) {
      return this.awextRegisterUnwatch(sysendHelper.broadcastListen(podNameString, (sysendEvent) => {
        const { content: eventData } = sysendEvent;
        if (eventData.channel === podNameString
          && communityTalkParamHitChecker(eventData.from, from)
          && communityTalkParamHitChecker(eventData.to, to)
          && communityTalkParamHitChecker(eventData.subject, subject)) {
          cb('cross_community_talk', eventData);
        }
      }));
    },
    crossResponse(cb) {
      return sysendHelper.response(podNameString, cb);
    },
    crossRequest(data) {
      return sysendHelper.require(podNameString, data);
    },
  });
};
