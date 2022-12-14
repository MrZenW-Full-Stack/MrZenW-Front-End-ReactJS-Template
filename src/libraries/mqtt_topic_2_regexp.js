/**
 * @author MrZenW
 * @email MrZenW@gmail.com, https://MrZenW.com
 * @create date 2021-05-25 13:13:19
 * @modify date 2021-05-25 13:13:20
 * @desc [description]
 */
const { escapeRegExp } = require('$/libraries/escape_regexp');

exports.mqttTopic2Regexp = (mqttTopic, returnString) => {
  // for original topic string: topicRegExp = `^${topic.replace(/\+/g, '[^/]+').replace(/#/g, '.*')}$`;
  const topicRegExpString = '^' + escapeRegExp(mqttTopic).replace(/\\\+/g, '[^/]+').replace(/#/g, '.*') + '$';
  if (returnString) return topicRegExpString;
  return new RegExp(returnString);
};
