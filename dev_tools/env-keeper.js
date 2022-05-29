/* eslint-disable */
'use strict';
var fs = require('fs');
var path = require('path');

var lineEnding = /\r?\n|\r(?!\n)/;
function checker (theEnv, variableArrayTemplate, cb) {
  console.debug('==[ENV-KEEPER]==CHECKER== Env will check by template ' + JSON.stringify(theEnv, '', 2) + ' by ' + JSON.stringify(variableArrayTemplate, '', 2));
  var theEnvMissing = [];
  var theEnvEmpty = [];
  var theEnvWithDefault = {};
  variableArrayTemplate.forEach(function (row) {
    row = ('' + row).trimStart();
    var equalMarkIndex = row.indexOf('=');
    var isCommentedOut = row.indexOf('#') === 0 || row.indexOf(';') === 0;
    if (row && !isCommentedOut && equalMarkIndex !== 0) {
      var variableName;
      var defaultValue = undefined;
      if (equalMarkIndex > -1) { // found
        variableName = row.slice(0, equalMarkIndex);
        defaultValue = row.slice(equalMarkIndex + 1);
      } else {
        variableName = row;
      }
      if (!Object.prototype.hasOwnProperty.call(theEnv, variableName)) {
        if (defaultValue !== undefined) {
          theEnvWithDefault[variableName] = defaultValue;
          if (defaultValue === '') {
            theEnvEmpty.push(variableName);
          }
        } else {
          theEnvMissing.push(variableName);
        }
      } else {
        if (theEnv[variableName] === '') {
          theEnvEmpty.push(variableName);
        }
      }
    }
  });

  Object.assign(theEnv, theEnvWithDefault);

  if (Object.keys(theEnvWithDefault).length) console.info('==[ENV-KEEPER]==INFO== These env variables with default value: '+ JSON.stringify(theEnvWithDefault))
  if (theEnvEmpty.length) console.warn('==[ENV-KEEPER]==WARN== These env variables are empty: '+ JSON.stringify(theEnvEmpty));
  if (theEnvMissing.length) {
    const error = new Error('==[ENV-KEEPER]==ERROR== These env variables are not exists: ' + JSON.stringify(theEnvMissing));
    if (typeof cb !== 'function') throw error;
    cb(error, null);
  } else {
    console.info('==[ENV-KEEPER]==OK ✓ == :) All env variables have been given!');
    if (typeof cb === 'function') cb(null, null);
  }
}



module.exports = {
  check: function (specificTemplate, opt, cb) {
    var lastArg = arguments[arguments.length - 1];
    if (typeof lastArg === 'function') {
      cb = lastArg;
    } else {
      cb = function() {};
    }
    if (typeof opt !== 'object') opt = {};

    var variableArrayTemplate;
    if (Array.isArray(specificTemplate)) {
      variableArrayTemplate = specificTemplate;
      opt = Object.assign({
        env: process.env
      }, opt);
      checker(opt.env, variableArrayTemplate, cb);
    } else {
      opt = Object.assign({
        template: '.env-keeper',
        env: process.env
      }, opt);
      var realpath = path.resolve(process.cwd(), './' + opt.template);
      fs.realpath(realpath, function (error, path) {
        if (error) throw error;
        fs.readFile(path, function (err, data) {
          if (err) throw err;
          var variableArrayTemplate = data.toString().split(lineEnding);
          checker(opt.env, variableArrayTemplate, cb);
        });
      });
    }
  },
  checkSync: function (specificTemplate, opt) {
    if (typeof opt !== 'object') opt = {};
    var variableArrayTemplate;
    if (Array.isArray(specificTemplate)) {
      variableArrayTemplate = specificTemplate;
      opt = Object.assign({
        env: process.env
      }, opt);
      checker(opt.env, variableArrayTemplate);
    } else {
      opt = Object.assign({
        template: '.env-keeper',
        env: process.env
      }, opt);
      var realpath = path.resolve(process.cwd(), './' + opt.template);
      var tmplPath = fs.realpathSync(realpath);
      var data = fs.readFileSync(tmplPath);
      var variableArrayTemplate = data.toString().split(lineEnding);
      checker(opt.env, variableArrayTemplate);
    }
  }
}