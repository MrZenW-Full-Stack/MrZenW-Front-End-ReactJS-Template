/**
 * @author MrZenW
 * @email mrzenw@gmail.com, https://mrzenw.com
 * @create date 2021-05-25 13:13:36
 * @modify date 2021-06-02 14:40:39
 * @desc [description]
 */
const getEventPosition = (event) => {
  let x = null;
  let y = null;
  let shiftKey = null;
  let touchId = null;
  if (event.changedTouches) {
    x = event.changedTouches[0].pageX;
    y = event.changedTouches[0].pageY;
    shiftKey = !!event.changedTouches[0].shiftKey;
    touchId = event.changedTouches[0].identifier;
  } else {
    x = event.pageX;
    y = event.pageY;
    shiftKey = !!event.shiftKey;
  }
  return {
    x,
    y,
    shiftKey,
    touchId,
  };
};

const ATTRIBUTE_NAME = 'x-resizeabled';
module.exports = (elem, handle, opts) => {
  handle = handle || elem;
  if (handle.getAttribute(ATTRIBUTE_NAME) + '' === '1') {
    console.warn('x-resizeabled is 1');
    return;
  }
  handle.setAttribute(ATTRIBUTE_NAME, '1');
  opts = opts || {};
  opts.maxWidth = opts.maxWidth || Infinity;
  opts.maxHeight = opts.maxHeight || Infinity;
  opts.minWidth = opts.minWidth || 0;
  if (opts.minWidth < 0) opts.minWidth = 0;
  opts.minHeight = opts.minHeight || 0;
  if (opts.minHeight < 0) opts.minHeight = 0;

  opts.onMouseDown = opts.onMouseDown || (() => {});
  opts.onMouseMove = opts.onMouseMove || (() => {});
  opts.onMouseUp = opts.onMouseUp || (() => {});
  function onMouseDown(eMouseDown) {
    // eMouseDown.preventDefault();
    // eMouseDown.stopPropagation();
    const { x: startX, y: startY, touchId: startTouchId } = getEventPosition(eMouseDown);

    const startElemWidth = elem.offsetWidth;
    const startElemHeight = elem.offsetHeight;

    opts.onMouseDown({
      width: startElemWidth,
      height: startElemHeight,
      objectRef: elem,
      handleRef: handle,
    });
    const touchScreenMoveThrottleGap = 0.5 * 1e3;
    let touchScreenMoveThrottleLastOccur = 0;
    const onMouseMove = (eMouseMove) => {
      const { x: currentX, y: currentY, touchId } = getEventPosition(eMouseMove);
      if (touchId !== startTouchId) return;
      if (touchId !== null) { // a touch screen device;
        const now = Date.now();
        if (now - touchScreenMoveThrottleLastOccur < touchScreenMoveThrottleGap) return;
        touchScreenMoveThrottleLastOccur = now;
      }

      // eMouseMove.preventDefault();
      // eMouseMove.stopPropagation();

      const diffX = currentX - startX;
      const diffY = currentY - startY;

      let resultWidth = startElemWidth + diffX;
      if (resultWidth < opts.minWidth) {
        resultWidth = opts.minWidth;
      } else if (resultWidth > opts.maxWidth) {
        resultWidth = opts.maxWidth;
      }
      elem.style.width = resultWidth + 'px';

      let resultHeight = startElemHeight + diffY;
      if (resultHeight < opts.minHeight) {
        resultHeight = opts.minHeight;
      } else if (resultWidth > opts.maxHeight) {
        resultHeight = opts.maxHeight;
      }
      elem.style.height = resultHeight + 'px';

      opts.onMouseMove({
        width: elem.offsetWidth,
        height: elem.offsetHeight,
        objectRef: elem,
        handleRef: handle,
      });
    };
    window.document.addEventListener('touchmove', onMouseMove, { passive: false });
    window.document.addEventListener('mousemove', onMouseMove, { passive: false });

    const onMouseUp = (eMouseUp) => {
      const { touchId } = getEventPosition(eMouseUp);
      if (touchId !== startTouchId) return;

      // eMouseUp.preventDefault();
      // eMouseUp.stopPropagation();

      window.document.removeEventListener('touchmove', onMouseMove, false);
      window.document.removeEventListener('mousemove', onMouseMove, false);

      window.document.removeEventListener('touchend', onMouseUp, false);
      window.document.removeEventListener('touchcancel', onMouseUp, false);
      window.document.removeEventListener('mouseup', onMouseUp, false);

      opts.onMouseUp({
        width: elem.offsetWidth,
        height: elem.offsetHeight,
        objectRef: elem,
        handleRef: handle,
      });
    };
    window.document.addEventListener('touchend', onMouseUp, false);
    window.document.addEventListener('touchcancel', onMouseUp, false);
    window.document.addEventListener('mouseup', onMouseUp, false);
  }
  handle.addEventListener('touchstart', onMouseDown, false);
  handle.addEventListener('mousedown', onMouseDown, false);
};
