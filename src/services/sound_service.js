/**
 * @author MrZenW
 * @email MrZenW@gmail.com, https://MrZenW.com
 * @create date 2021-05-25 13:21:04
 * @modify date 2021-06-04 16:42:25
 * @desc [description]
 */
const { Howl } = require('howler');
const { awextify, getAwext, parsePath } = require('$/awext/core');

const collapse = require('$/assets/sounds/wav/04-secondary-system-sounds/navigation_transition-left.wav');
const uncollapse = require('$/assets/sounds/wav/04-secondary-system-sounds/navigation_transition-right.wav');

const webwindow_minimise = require('$/assets/sounds/wav/03-primary-system-sounds/navigation_backward-selection-minimal.wav');
const webwindow_recover = require('$/assets/sounds/wav/03-primary-system-sounds/navigation_forward-selection-minimal.wav');

exports.grabSoundService = (name) => {
  const awextName = [].concat(['sound_service'], parsePath(name, '/'));
  const instance = getAwext(awextName);
  if (instance) return instance;
  return awextify({ awextName, bindThisToBase: true }, {
    registerSounds(soundDict) {
      this.awextSetManyPaths(Object.entries(soundDict).reduce((acc, [soundName, soundFile]) => {
        const soundSettings = {
          src: [soundFile],
          preload: true,
        };
        acc[soundName] = new Howl(Object.assign({}, soundSettings, {
          onend: () => {
            this.awextEmit('end', soundName, soundSettings, acc[soundName]);
          },
        }));
        return acc;
      }, {}), 'howlObjects');
      return this;
    },
    unregisterSounds(soundNameArray) {
      if (!Array.isArray(soundNameArray)) soundNameArray = [soundNameArray];
      soundNameArray.forEach((soundName) => {
        const howlObject = this.awextGetPath(['howlObjects', soundName]);
        if (howlObject) {
          howlObject.unload();
          this.awextRemovePath(['howlObjects', soundName]);
        }
      });
      return this;
    },
    play(soundName, opt) {
      opt = opt || {};
      const howlObject = this.awextGetPath(['howlObjects', soundName]);
      if (!howlObject) throw new Error(`Sound effect ${soundName} does not exist!`);
      if ('function' === typeof opt.onend) {
        const unwatchFunc = this.awextOn('end', (_, eventSoundName, eventSoundSettings, eventHowlObject) => {
          if (eventSoundName === soundName) {
            unwatchFunc();
            opt.onend(eventSoundName, eventSoundSettings, eventHowlObject);
          }
        });
      }
      howlObject.play();
    },
  });
};

exports.grabBlocklySoundService = (name) => {
  return exports.grabSoundService([name, 'blockly']).registerSounds({
    toolbox_collapse: collapse,
    toolbox_uncollapse: uncollapse,
  });
};

exports.grabWebWindowSoundService = (name) => {
  return exports.grabSoundService([name, 'web_window']).registerSounds({
    minimise: webwindow_minimise,
    maximise: webwindow_minimise,
    recover: webwindow_recover,
  });
};

exports.grabControlPanelToolbarSoundService = (name) => {
  return exports.grabSoundService([name, 'control_panel_toolbar']).registerSounds({
    collapse,
    uncollapse,
  });
};
