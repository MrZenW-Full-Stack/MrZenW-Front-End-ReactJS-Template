/**
 * @author MrZenW
 * @email mrzenw@gmail.com, https://mrzenw.com
 * @create date 2021-05-25 13:20:00
 * @modify date 2021-09-22 16:04:04
 * @desc [description]
 */
const protobuf = require('protobufjs');
const mqtt = require('mqtt');
const { nanoid } = require('nanoid');
const mqttTopic2Regexp = require('$/libraries/mqtt_topic_2_regexp');
const { string2buffer } = require('$/libraries/string_and_buffer');
const {
  awextify,
  getAwext,
  parsePath,
  isKeyValueObject,
} = require('$/awext/core');
const jsonDescriptor = require('./protobuf_definitions/position.json');

// const debug = debugLib(import.meta.url);

exports.grabMqttService = (awextName) => {
  awextName = [].concat(['mqtt_service'], parsePath(awextName, '/'));
  const instance = getAwext(awextName);
  if (instance) return instance;
  return awextify({ awextName, bindThisToBase: true }, {
    _messageCount: 1,
    connUUID: nanoid(9),
    async connect() {
      return new Promise((resolve) => {
        let called = false;
        if (this.isConnected()) {
          resolve(this.mqttClient);
          return;
        }
        this.mqttClient = mqtt.connect.apply(this, arguments);
        this.mqttClient.on('message', (topic, message, packet) => {
          this.awextEmit('message', topic, message, packet);
        });
        this.mqttClient.on('connect', () => {
          if (!called) {
            Object.values(this.subscribedTopics).forEach((_argArray) => {
              _argArray.forEach((_args) => {
                this.mqttClient.subscribe.apply(this.mqttClient, _args);
              });
            });
            // send offline chunk
            while (this.publishOfflineChunk.length > 0) {
              this.mqttClient.publish.apply(this.mqttClient, this.publishOfflineChunk.shift());
            }
            this.awextEmit('connect');
            resolve(this.mqttClient);
          }
          called = true;
        });
        this.mqttClient.on('disconnect', () => {
          this.awextEmit('disconnect');
        });
      });
    },
    isConnected() {
      if (this.mqttClient) return this.mqttClient.connected;
      return false;
    },
    subscribedTopics: {},
    addSubscribedTopic(topic, args) {
      this.subscribedTopics[topic] = this.subscribedTopics[topic] || [];
      this.subscribedTopics[topic].push(args);
    },
    removeSubscribedTopic(topic) {
      this.subscribedTopics[topic] = [];
    },
    subscribeIfNeeded(topic, options, callback) {
      let args = Array.from(arguments);
      if (typeof options === 'function') args = [topic];
      if (typeof callback === 'function') args = [topic, options];
      this.addSubscribedTopic(topic, args);
      if (this.isConnected()) {
        this.mqttClient.subscribe.apply(this.mqttClient, arguments);
      }
    },
    unsubscribeIfNeeded(topic) {
      this.removeSubscribedTopic(topic);
      if (this.isConnected()) {
        this.mqttClient.unsubscribe.apply(this.mqttClient, arguments);
      }
    },
    onMessage(cb) {
      return this.awextOn('message', cb);
    },
    _protobufPositionMessasge: null,
    get protobufPositionMessasge() {
      if (!this._protobufPositionMessasge) {
        this._protobufPositionMessasge = protobuf.Root.fromJSON(jsonDescriptor)
          .nested
          .MqttMessagePackage
          .PositionMessage;
      }
      return this._protobufPositionMessasge;
    },
    publishOfflineChunk: [],
    publish(topic, message, options) {
      const args = Array.from(arguments);
      options = options || {};
      args[0] = parsePath(topic, '/').join('/');
      if (!ArrayBuffer.isView(message)) {
        if (isKeyValueObject(message)) {
          message = string2buffer(JSON.stringify(message));
        } else {
          message = string2buffer(message);
        }
      }
      args[1] = message;
      if (options.extDigestEncoder === true) {
        options.extDigestEncoder = this._digestEncoder;
      }
      if ('function' === typeof options.extDigestEncoder) {
        const hashSum = options.extDigestEncoder(args[0], args[1]);
        args[1] = new Uint8Array([].concat(Array.from(hashSum), Array.from(args[1])));
      }
      args[2] = options;
      if (!this.isConnected()) {
        this.publishOfflineChunk.push(args);
        return null;
      } else {
        return this.mqttClient.publish.apply(this.mqttClient, args);
      }
    },
    sendMessage(topic, message) {
      const args = Array.from(arguments);
      const messageObject = isKeyValueObject(message) ? message : { _data_: message };
      args[1] = JSON.stringify(Object.assign({}, messageObject, {
        _id_: nanoid(9),
        _conn_: this.connUUID,
        _count_: (this._messageCount += 1),
      }));
      return this.publish.apply(this, args);
    },
    setDigestEncoder(encoder) {
      this._digestEncoder = 'function' === typeof encoder ? encoder : null;
      return this._digestEncoder;
    },

    setDigestDecoder(decoder) {
      this._digestDecoder = 'function' === typeof decoder ? decoder : null;
      return this._digestDecoder;
    },
    sendMessageWithDigestEncoder(topic, message, opt) {
      return this.sendMessage(topic, message, Object.assign({}, opt, {
        extDigestEncoder: true,
      }));
    },
    onTopic(topic, options, cb) {
      if ('function' === typeof options) {
        cb = options;
        options = null;
      }
      cb = cb || (() => {});
      options = options || {};
      topic = parsePath(topic, '/').join('/');
      this.subscribeIfNeeded(topic);
      let topicRegExp = null;
      if (topic.indexOf('+') > -1 || topic.indexOf('#') > -1) {
        topicRegExp = mqttTopic2Regexp(topic, 'returnString');
      }
      const unwatch = this.onMessage((_, _topic, message, packet) => {
        if (topic === _topic || (topicRegExp && (new RegExp(topicRegExp)).test(_topic))) {
          let payload = message;
          if (options.extDigestDecoder === true) {
            options.extDigestDecoder = this._digestDecoder;
          }
          if ('function' === typeof options.extDigestDecoder) {
            const decodedMessage = options.extDigestDecoder(_topic, message);
            if (!decodedMessage) {
              console.warn('Received an invalid mqtt message! ' + _topic);
              return;
            }
            payload = decodedMessage.payload;
          }
          cb(_topic, payload, packet);
        }
      });
      return () => {
        this.unsubscribeIfNeeded(topic);
        unwatch();
      };
    },
    onTopicWithDigestDecoder(topic, options, cb) {
      if ('function' === typeof options) {
        cb = options;
        options = null;
      }
      cb = cb || (() => {});
      options = options || {};
      return this.onTopic(topic, Object.assign({}, options, {
        extDigestDecoder: true,
      }), (receivedTopic, receivedPayload, receivedPacket) => {
        let payloadJSON;
        try {
          payloadJSON = JSON.parse(receivedPayload.toString());
        } catch (error) {
          // no json
          payloadJSON = undefined;
        }
        cb(receivedTopic, receivedPayload, receivedPacket, payloadJSON);
      });
    },
    sendMessagePosition(topic, message) {
      const args = Array.from(arguments);
      const messageObject = isKeyValueObject(message) ? message : { _data_: message };
      args[1] = Object.assign({}, messageObject, {
        _id_: nanoid(9),
        _conn_: this.connUUID,
        _count_: (this._messageCount += 1),
      });
      args[1] = this.protobufPositionMessasge.encode(args[1]).finish();
      return this.publish.apply(this, args);
    },
    onTopicPosition(topic, options, cb) {
      if ('function' === typeof options) {
        cb = options;
        options = null;
      }
      cb = cb || (() => {});
      options = options || {};
      return this.onTopic.call(this, topic, options, (receTopic, recePayload, recePacket) => {
        cb(receTopic, this.protobufPositionMessasge.decode(recePayload), recePacket);
      });
    },

    // request and response
    request(topic, message, options, responseCallback) {
      const args = Array.from(arguments);
      if (typeof options === 'function') {
        responseCallback = options;
        options = {};
      }
      options = options || {};
      const reqId = nanoid(9);

      const messageObject = isKeyValueObject(message) ? message : { _data_: message };
      messageObject._type_ = 'request';
      messageObject._req_id_ = reqId;
      args[1] = Object.assign({}, messageObject);
      let unTopic = null;
      let timeoutHD = null;
      const finish = () => {
        if (typeof unTopic !== 'function' || !timeoutHD) return false;
        const _timeoutHD = timeoutHD;
        timeoutHD = null;
        const _unTopic = unTopic;
        unTopic = null;

        clearTimeout(_timeoutHD);
        _unTopic();
        return true;
      };
      timeoutHD = setTimeout(() => {
        if (finish()) {
          const error = new Error('Request timeout');
          error.request = {
            topic,
            message,
            options,
          };
          responseCallback(error);
        }
      }, options.requestTimeout || 5 * 1e3);
      // on response
      const respTopic = [].concat(parsePath(topic, '/'), ['resp', reqId]);
      unTopic = this.onTopicWithDigestDecoder(respTopic, options, (receivedTopic, receivedPayload, receivedPacket) => {
        let payloadJSON;
        try {
          payloadJSON = JSON.parse(receivedPayload.toString());
        } catch (error) {
          // no json
          payloadJSON = undefined;
        }
        if (payloadJSON && isKeyValueObject(payloadJSON) && payloadJSON._type_ === 'response' && payloadJSON._req_id_ === reqId) {
          if (finish()) {
            responseCallback(null, {
              topic: receivedTopic,
              payload: receivedPayload,
              payloadJSON,
              packet: receivedPacket,
            });
          }
        }
      });
      args[3] = undefined; // OG callback
      // send message
      // debugger;
      this.sendMessageWithDigestEncoder.apply(this, args);
      return finish;
    },

    listenToRequest(topic, options, onReceive) {
      if (typeof options === 'function') {
        onReceive = options;
        options = {};
      }
      options = options || {};
      return this.onTopicWithDigestDecoder(topic, options, (receivedTopic, receivedPayload, receivedPacket) => {
        let payloadJSON;
        try {
          const payloadString = receivedPayload.toString();
          payloadJSON = JSON.parse(payloadString);
        } catch (error) {
          // no json
          payloadJSON = undefined;
        }
        if (payloadJSON && isKeyValueObject(payloadJSON) && payloadJSON._type_ === 'request') {
          onReceive({
            topic: receivedTopic,
            payload: receivedPayload,
            payloadJSON,
            packet: receivedPacket,
          },
          { // response
            reply: (responseData) => {
              const reqId = payloadJSON._req_id_;
              const respTopic = [].concat(parsePath(receivedTopic, '/'), ['resp', reqId]);
              const responseDataObject = isKeyValueObject(responseData) ? responseData : { _data_: responseData };
              responseDataObject._type_ = 'response';
              responseDataObject._req_id_ = reqId;
              return this.sendMessageWithDigestEncoder(respTopic, Object.assign({}, responseDataObject), options);
            },
          });
        }
      });
    },
  });
};
