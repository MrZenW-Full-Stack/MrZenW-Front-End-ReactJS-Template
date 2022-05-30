/**
 * @author MrZenW
 * @email mrzenw@gmail.com, https://mrzenw.com
 * @create date 2021-05-25 13:13:10
 * @modify date 2021-06-02 15:09:16
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

const ATTRIBUTE_NAME = 'x-moveabled';
exports.moveable = (elem, handle, opts) => {
  handle = handle || elem;
  if (handle.getAttribute(ATTRIBUTE_NAME) + '' === '1') {
    console.info('this div has been attached the special variable x-moveabled to 1');
    return;
  }
  handle.setAttribute(ATTRIBUTE_NAME, '1');
  opts = opts || {};
  opts.onMouseDown = opts.onMouseDown || (() => {});
  opts.onMouseMove = opts.onMouseMove || (() => {});
  opts.onMouseUp = opts.onMouseUp || (() => {});
  function onMouseDown(eMouseDown) {
    // eMouseDown.preventDefault();
    // eMouseDown.stopPropagation();
    const { x: startX, y: startY, touchId: startTouchId } = getEventPosition(eMouseDown);

    // const { top: startTop, left: startLeft } = $elem.position();
    const elemStyle = elem.currentStyle || window.getComputedStyle(elem);
    const startTop = elem.offsetTop - (parseInt(elemStyle.marginTop, 10) || 0);
    const startLeft = elem.offsetLeft - (parseInt(elemStyle.marginLeft, 10) || 0);
    // $windowRef.css('right', '');
    elem.style.right = '';
    // $windowRef.css('bottom', '');
    elem.style.bottom = '';
    // $windowRef.css('left', startLeft);
    elem.style.left = startLeft + 'px';
    // $windowRef.css('top', startTop);
    elem.style.top = startTop + 'px';

    // $moveHandleRef.css('cursor', 'grabbing');
    handle.style.cursor = 'grabbing';

    opts.onMouseDown({
      x: startLeft,
      y: startTop,
      objectRef: elem,
      handleRef: handle,
    });
    const onMouseMove = (eMouseMove) => {
      const { x: currentX, y: currentY, touchId } = getEventPosition(eMouseMove);
      if (touchId !== startTouchId) return;

      // eMouseMove.preventDefault();
      // eMouseMove.stopPropagation();

      const diffX = currentX - startX;
      const diffY = currentY - startY;
      elem.style.left = (startLeft + diffX) + 'px';
      elem.style.top = (startTop + diffY) + 'px';
      opts.onMouseMove({
        x: startLeft,
        y: startTop,
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

      handle.style.cursor = 'grab';
      const currentStyle = elem.currentStyle || window.getComputedStyle(elem);
      const pos = {
        top: elem.offsetTop - (parseInt(currentStyle.marginTop, 10) || 0),
        left: elem.offsetLeft - (parseInt(currentStyle.marginLeft, 10) || 0),
      };
      opts.onMouseUp({
        x: pos.left,
        y: pos.top,
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
