/**
 * @author MrZenW
 * @email mrzenw@gmail.com, https://mrzenw.com
 * @create date 2021-05-27 17:20:43
 * @modify date 2021-05-28 12:51:06
 * @desc [description]
 */
const { nanoid } = require('nanoid');
const { awextify, getAwext, parsePath } = require('$/awext/core');
const { loop } = require('$/libraries/nextask');

exports.grabMqttNtpService = (subPath) => {
  const awextName = ['mqtt_ntp_service'].concat(parsePath(subPath, '/'));
  const existing = getAwext(awextName);
  if (existing) return existing;
  const init = (awext, baseObject) => {
    baseObject._hostTopic = null;
  };
  return awextify({ awextName, bindThisToBase: true }, {
    setMqttService(mqttService) {
      this._mqttService = mqttService;
    },
    setHostTopic(topic) {
      this._hostTopic = parsePath(topic, '/');
    },
    send(topic, prefixData) {
      topic = parsePath(topic, '/');
      return new Promise((resolve) => {
        let called = false;
        let unwatch = null;
        let calledHandle = setTimeout(() => {
          if (!called) {
            called = true;
            clearTimeout(calledHandle);
            unwatch();
            resolve(null);
          }
        }, 10 * 1e3);
        const topicResp = topic.concat(['resp']);
        unwatch = this._mqttService.onTopic(topicResp, (receTopic, recePayload) => {
          if (!called) {
            called = true;
            clearTimeout(calledHandle);
            unwatch();
            resolve(recePayload);
          }
        });
        prefixData += '';
        this._mqttService.publish(topic, prefixData + Date.now());
      });
    },
    receive(topic) {
      return this._mqttService.onTopic(topic, (receTopic, recePayload) => {
        const receiveTime = Date.now();
        setTimeout(() => {
          const recePayloadString = recePayload.toString();
          const payloadString = recePayloadString + ',' + receiveTime + ',' + Date.now();
          this._mqttService.publish(receTopic + '/resp', payloadString);
        }, 0);
      });
    },
    get timeDifference() {
      return this.awextGetPath('timeDifference');
    },
    startSending(cb) {
      this.awextUnwatchWithNS('startSending');
      if (!this._mqttService) throw new Error('The setMqttService() function need to be called first!');
      if (!this._hostTopic) throw new Error('The setHostTopic() function need to be called first!');
      cb = cb || (() => {});
      let isRunning = true;
      loop(async (next) => {
        if (!isRunning) return;
        const topic = this._hostTopic.concat([nanoid()]);
        let result = await this.send(topic, '');
        const now = Date.now();
        if (result) {
          const resultString = result.toString() + ',' + now;
          const timePoints = resultString.split(',');
          const difference = ((timePoints[3] - timePoints[0]) - (timePoints[2] - timePoints[1])) / 2;
          this.awextSetPath('timeDifference', difference);
          cb(difference);
        } else {
          cb(result);
        }

        setTimeout(next, 10 * 1e3);
        // next();
      });
      return this.awextRegisterUnwatchWithNS('startSending', () => {
        isRunning = false;
      });
    },
    startReceiving() {
      this.awextUnwatchWithNS('startReceiving');
      if (!this._mqttService) throw new Error('The setMqttService() function need to be called first!');
      if (!this._hostTopic) throw new Error('The setHostTopic() function need to be called first!');
      const topic = this._hostTopic.concat(['+']);
      return this.awextRegisterUnwatchWithNS('startReceiving', this.receive(topic));
    },
  }, init);
};
