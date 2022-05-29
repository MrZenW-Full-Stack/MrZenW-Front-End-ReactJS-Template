/**
 * @author MrZenW
 * @email mrzenw@gmail.com, https://mrzenw.com
 * @create date 2021-05-25 13:21:09
 * @modify date 2021-10-19 17:28:48
 * @desc [description]
 */
const {
  awextify,
  getAwext,
  parsePath,
  // pathSetter,
  // pathGetter,
} = require('$/awext/core');
// const { animateFrame } = require('$/libraries/animate');

module.exports = {
  grabUiService: (awextName) => {
    awextName = [].concat(['ui_service'], parsePath(awextName, '/'));
    let instance = getAwext(awextName);
    if (!instance) {
      instance = awextify({ awextName, bindThisToBase: true }, {
        get videoPlaylistUnwrapped() {
          return this.awextGetPath('videoPlaylistUnwrapped');
        },
        set videoPlaylistUnwrapped(newValue) {
          return this.awextSetPath('videoPlaylistUnwrapped', newValue);
        },
        watchVideoPlaylistUnwrapped(cb) {
          return this.awextWatchPath('videoPlaylistUnwrapped', cb);
        },
      });
      // instance._startDetectWebpageFPS();
    }
    return instance;
  },
};
