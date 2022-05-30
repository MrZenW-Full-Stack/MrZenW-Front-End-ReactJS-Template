/**
 * @author MrZenW
 * @email MrZenW@Gmail.com, https://MrZenW.com
 * @create date 2021-05-25 13:14:18
 * @modify date 2022-03-07 11:27:35
 * @desc [description]
 */

const sysend = require('sysend');

const DATA_TYPE = 'sysend_helper';
exports.request = (channel, content) => {
  return new Promise((resolve) => {
    channel += '';
    const now = Date.now();
    const messageId = now + '_' + Math.random();
    const receiveFunc = (event) => {
      // console.log(JSON.stringify(event), JSON.stringify(content), 'received event')
      if (typeof event === 'string') {
        try {
          event = JSON.parse(event);
        } catch (error) {
          // pass
        }
      }
      if (event.dataType === DATA_TYPE
        && event.channel === channel
        && event.messageType === 'response'
        && event.messageId === messageId
      ) {
        sysend.off(channel, receiveFunc);
        resolve(event);
      }
    };
    sysend.on(channel, receiveFunc);
    const data = {
      dataType: DATA_TYPE,
      channel: channel,
      messageType: 'request',
      messageId: messageId,
      requestTime: Date.now(),
      content: content,
    };
    sysend.broadcast(channel, data);
  });
};

exports.listenTo = (channel, callback) => {
  const processFunc = async (event) => {
    if (typeof event === 'string') {
      try {
        event = JSON.parse(event);
      } catch (error) {
        // pass
      }
    }
    if (event.dataType !== DATA_TYPE || event.messageType !== 'request' || event.channel !== channel) return;
    const messageId = event.messageId;
    callback(event, (resContent) => {
      const resData = Object.assign({}, event, {
        dataType: DATA_TYPE,
        channel: channel,
        messageType: 'response',
        messageId: messageId,
        responseTime: Date.now(),
        content: resContent,
      });
      sysend.broadcast(channel, resData);
    });
  };
  sysend.on(channel, processFunc);
  return () => {
    sysend.off(channel, processFunc);
  };
};

exports.receiveBroadcast = (channel, cb) => {
  const processFunc = (event) => {
    if (typeof event === 'string') {
      try {
        event = JSON.parse(event);
      } catch (error) {
        return;
      }
    }
    if (event.dataType === DATA_TYPE && event.messageType === 'broadcast') {
      cb(event);
    }
  };
  sysend.on(channel, processFunc);
  return () => {
    sysend.off(channel, processFunc);
  };
};

exports.publishBroadcast = (channel, content) => {
  const now = Date.now();
  const messageId = now + '_' + Math.random();
  return sysend.broadcast(channel, {
    dataType: DATA_TYPE,
    channel: channel,
    messageType: 'broadcast',
    messageId: messageId,
    content: content,
  });
};
