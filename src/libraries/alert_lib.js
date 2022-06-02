/**
 * @author MrZenW
 * @email MrZenW@gmail.com, https://MrZenW.com
 * @create date 2021-05-25 13:12:05
 * @modify date 2021-09-24 11:10:03
 * @desc [description]
 */

const sweetalert2 = require('sweetalert2');
const { animateFrame, easeOutSine } = require('./animate');
const { createElement } = require('./html_element_creator');
const { createQueueWorker } = require('./queue_worker');

const AlertLib = {};

AlertLib.alertSuccess = function alertSuccess(arg0) {
  arg0 = (typeof arg0 === 'string') ? { title: arg0 } : arg0;
  arg0.icon = 'success';

  const args = Array.from(arguments);
  args[0] = arg0;
  return AlertLib.alertFire.apply(this, args);
};

AlertLib.alertError = function alertError(arg0) {
  if (arg0 instanceof Error) {
    arg0 = arg0.message;
  }
  arg0 = (typeof arg0 === 'string') ? { title: arg0 } : arg0;
  arg0.icon = 'error';

  const args = Array.from(arguments);
  args[0] = arg0;
  return AlertLib.alertFire.apply(this, args);
};

AlertLib.alertWarning = function alertWarning(arg0) {
  arg0 = (typeof arg0 === 'string') ? { title: arg0 } : arg0;
  arg0.icon = 'warning';

  const args = Array.from(arguments);
  args[0] = arg0;
  return AlertLib.alertFire.apply(this, args);
};

AlertLib.alertInfo = function alertInfo(arg0) {
  arg0 = (typeof arg0 === 'string') ? { title: arg0 } : arg0;
  arg0.icon = 'info';

  const args = Array.from(arguments);
  args[0] = arg0;
  return AlertLib.alertFire.apply(this, args);
};

AlertLib.alertConfirm = function alertConfirm(arg0) {
  arg0 = (typeof arg0 === 'string') ? { title: arg0 } : arg0;
  arg0.icon = 'question';

  const args = Array.from(arguments);
  args[0] = arg0;
  return AlertLib.alertFire.apply(this, args);
};

AlertLib.alertNotification = (() => {
  let notificationRootContainerElement = null;
  const initNotificationElement = () => {
    if (!notificationRootContainerElement) {
      notificationRootContainerElement = createElement(`
      <div>
      </div>
      `);
      Object.assign(notificationRootContainerElement.style, {
        position: 'absolute',
        inset: '0px 0px 0px auto',
        overflowX: 'clip',
        overflowY: 'clip',
        maxHeight: '100%',
        height: 'fit-content',
        width: 'fit-content',
        zIndex: '9999',
        paddingTop: '15px',
      });
      document.body.appendChild(notificationRootContainerElement);
    }
    return notificationRootContainerElement;
  };
  return function alertNotification(arg0) {
    arg0 = (typeof arg0 === 'string') ? { title: arg0 } : arg0;
    Object.assign(arg0, {
      toast: true,
      showTimerProgressBar: true,
      position: 'center',
      icon: 'info',
      showConfirmButton: false,
      timer: 5 * 1e3,
    }, arg0);
    const container = initNotificationElement();
    // icon
    let iconHtml = '';
    switch (arg0.icon.toLowerCase()) {
      case 'error':
        iconHtml = '<i style="color: red; font-size: 2rem" class="fas fa-times-circle"></i>';
        break;
      case 'success':
        iconHtml = '<i style="color: green; font-size: 2rem" class="fas fa-check-circle"></i>';
        break;
      case 'warning':
        iconHtml = '<i style="color: orange; font-size: 2rem" class="fas fa-exclamation-circle"></i>';
        break;
      case 'question':
        iconHtml = '<i style="color: green; font-size: 2rem" class="fas fa-question-circle"></i>';
        break;
      case 'info':
      default:
        iconHtml = '<i style="color: green; font-size: 2rem" class="fas fa-info-circle"></i>';
        break;
    }
    // insert element
    const padding = 20;
    const flexStyle = 'display: flex; justify-content: flex-start; align-items: center';
    const progressBarHtml = !arg0.showTimerProgressBar ? '' : `<div alert-lib-progress-bar style="position: relative; left: 0px; bottom: 0px; width: 100%; height: 5px; background-color: rgba(128, 128, 128, 0.3)">`;
    const toastElementContainer = createElement(`
      <div style="height: fit-content; width: fit-content; overflow: visible; margin: 0px 0px 0px auto;">
        <div style="margin: 0px ${padding}px; overflow: hidden; width: fit-content; height: fit-content; transform: translateX(110%); border: 1px solid rgba(128, 128, 128, 0.5); border-radius: 10px; box-shadow: 0px 0px 15px rgb(0, 0, 0); color: var(--theme-color)" class="theme-bg-glass" role="alert" aria-live="assertive" aria-atomic="true">
          <div style="min-height: 75px; min-width: 350px; ${flexStyle}">
            <div style="width: 50px; text-align: right;">
              ${iconHtml}
            </div>
            <div style="width: 100%; padding-left: 10px; padding-right: 20px">
              <div style="margin: 0.618rem auto; width: fit-content;">
                ${arg0.html || arg0.title}
              </div>
            </div>
          </div>
          ${progressBarHtml}
          </div>
        </div>
      </div>
    `);
    const toastElement = toastElementContainer.querySelector('div');
    container.insertBefore(toastElementContainer, container.childNodes[0]);

    const currentStyle = toastElementContainer.currentStyle || window.getComputedStyle(toastElementContainer);
    const heightPx = parseInt(currentStyle.height, 10) || 0;
    toastElementContainer.style.height = '0px';

    let showStatus = true;
    setTimeout(() => {
      container.style.minHeight = heightPx + (padding * 2) + 'px';
      animateFrame((p) => {
        const pEase = easeOutSine(p);
        // container
        const _h = heightPx + (padding * 1); // important, for the box-shadow at the bottom
        // const _h = heightPx;
        // const _w = widthPx + (padding * 2);
        const value = parseInt(pEase * (_h - 0) + 0, 10);
        toastElementContainer.style.height = value + 'px';

        // element
        const translateX = (pEase * (0 - 110) + 110);
        toastElement.style.transform = 'translateX(' + translateX + '%)';
      }, 0.3 * 1e3);
    }, 0);
    // listen to the event for hiding
    return new Promise((resolve) => {
      function hide() {
        if (showStatus) {
          showStatus = false;
          animateFrame((p) => {
            const pEase = easeOutSine(p);
            const translateX = (pEase * (110 - 0) + 0);
            toastElement.style.transform = 'translateX(' + translateX + '%)';
            toastElement.style.opacity = 1 - pEase;
            if (p === 1) {
              container.removeChild(toastElementContainer);
              container.style.minHeight = '0px';
              resolve();
            }
          }, 0.3 * 1e3);
        }
      }
      const progressBar = toastElementContainer.querySelector('[alert-lib-progress-bar]');
      if (progressBar) {
        animateFrame((p) => {
          const _progress = (1 - p) * 100;
          progressBar.style.width = _progress + '%';
          if (p === 1) {
            hide();
          }
        }, arg0.timer);
      } else {
        setTimeout(() => {
          hide();
        }, arg0.timer);
      }
    });
  };
})();

AlertLib.alertFire = ((ogFire) => {
  const alertFireQueueWorker = createQueueWorker();
  const syncFire = function alertFire(/* args */) {
    const args = Array.from(arguments);
    return new Promise((resolve) => {
      alertFireQueueWorker((next) => {
        ogFire.apply(this, args)
          .then((res) => {
            resolve(res);
            setTimeout(next, 0);
          });
      });
    });
  };
  sweetalert2.fire = syncFire;
  return syncFire;
})(sweetalert2.fire);

Object.assign(sweetalert2, AlertLib);

window.alertLib = sweetalert2;
module.exports = sweetalert2;
