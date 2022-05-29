const React = require('react');
const ReactModal = require('react-modal');
const PropTypes = require('prop-types');
const cx = require('classnames');
const { createUseStyles } = require('react-jss');
const { useAwext } = require('$/awext/core');
const { animateFrame, easeOutBack, easeInBack } = require('$/libraries/animate');
const { changeElement } = require('$/libraries/subtransform');

ReactModal.setAppElement('#root');
const iconClosePng = require('$/assets/images/icon-close.png');

const useStyles = createUseStyles({
  closeButton: {
    position: 'fixed',
    top: '10px',
    left: '10px',
    outline: 'none',
    cursor: 'pointer',
    '& > img': {
      border: '2px white solid',
      width: '50px',
      height: '50px',
      boxShadow: 'rgb(255, 255, 255) 0px 0px 15px',
      borderRadius: '15px',
    },
  },
  childrenContainerDiv: {
    height: '100%',
    width: '100%',
    border: '0px',
    padding: '0px',
    margin: '0px',
  },
});

const actions = {
  _useAwextBeforeRender(args) {
    this.isOpen = args.props.isOpen;
  },
  __escapeKeyListener(event) {
    const { code } = event;
    if (`${code}`.toLowerCase() === 'escape') {
      this.handleClickCloseButton(event);
    }
  },
  get isOpen() {
    return this.awextGetPath('isOpen');
  },
  set isOpen(newValue) {
    this.awextSetPath('isOpen', newValue);
  },
  onAfterOpen() {
    window.addEventListener('keyup', this.__escapeKeyListener, false);
    const args = Array.from(arguments);
    const { props } = this.useAwextArgs;
    let returnVal;
    if (props.onAfterOpen) {
      returnVal = props.onAfterOpen(...args);
    }
    if (this.refChildrenContainer) {
      const refOverlayDisplayValue = this.refOverlay.style.display;
      this.refOverlay.style.display = 'none';
      setTimeout(() => {
        this.refOverlay.style.display = refOverlayDisplayValue;
        animateFrame((p) => {
          const progress = easeOutBack(p);
          // this.refOverlay.style.opacity = p;
          this.refChildrenContainer.style.transform = `scale(${progress})`;
        });
      }, 0);
    }
    return returnVal;
  },
  onAfterClose() {
    console.log('onAfterClose');
    window.removeEventListener('keyup', this.__escapeKeyListener, false);
    const args = Array.from(arguments);
    const { props } = this.useAwextArgs;
    let returnVal;
    if (props.onAfterClose) {
      returnVal = props.onAfterClose(...args);
    }
    return returnVal;
  },
  receiveContentRef(ref) {
    const { props } = this.useAwextArgs;
    let returnVal;
    if ('function' === typeof props.contentRef) {
      returnVal = props.contentRef(ref);
    }
    this.refContent = ref;
    // append close button root
    return returnVal;
  },
  receiveOverlayRef(ref) {
    const { props } = this.useAwextArgs;
    let returnVal;
    if ('function' === typeof props.overlayRef) {
      returnVal = props.overlayRef(ref);
    }
    this.refOverlay = ref;
    return returnVal;
  },
  receiveChildrenContainerRef(ref) {
    this.refChildrenContainer = ref;
  },
  handleClickCloseButton(event) {
    animateFrame((p) => {
      const progress = easeInBack(p);
      changeElement(this.refChildrenContainer, 'scale', 1 - progress);
      this.refOverlay.style.opacity = (1 - p) * (1 - 0.4) + 0.5;
      if (p === 1) {
        const { onClickCloseButton } = this.useAwextArgs.props;
        if ('function' === typeof onClickCloseButton) {
          onClickCloseButton(event);
        }
      }
    });
  },
};

module.exports = (props) => {
  const awext = useAwext({ props }, actions, React);
  const {
    // isOpen,
    children,
    onClickCloseButton,
    contentStyle,
  } = props;
  const styleNames = useStyles({ contentStyle });
  let closeButton = null;
  if (onClickCloseButton) {
    closeButton = props.closeButton;
    if (closeButton === undefined) {
      closeButton = (
        <a
          className={styleNames.closeButton}
          role="button"
          onKeyDown={() => {}}
          onClick={awext.handleClickCloseButton}
          tabIndex="-1"
        >
          <img
            src={iconClosePng}
            alt="close_button"
          />
        </a>
      );
    }
  }
  const newProps = Object.assign({}, props, {
    isOpen: awext.isOpen,
    style: {
      overlay: {
        position: 'absolute',
        zIndex: '3000',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderRadius: '0px',
        overflow: 'hidden',
      },
      content: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        inset: '0px 0px 0px 0px',
        border: '0px',
        padding: '0px',
        margin: '0px',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderRadius: '0px',
        overflow: 'hidden',
      },
    },
    onAfterOpen: awext.onAfterOpen,
    onAfterClose: awext.onAfterClose,
    contentRef: awext.receiveContentRef,
    overlayRef: awext.receiveOverlayRef,
  });
  return (
    <ReactModal {...newProps}>
      <div
        className={styleNames.childrenContainerDiv}
        ref={awext.receiveChildrenContainerRef}
      >
        {children}
      </div>
      {closeButton}
    </ReactModal>
  );
};

module.exports.propTypes = {
  isOpen: PropTypes.bool,
  closeButton: PropTypes.node,
  onClickCloseButton: PropTypes.func,
  refCloseButton: PropTypes.func,
  children: PropTypes.node.isRequired,
  contentStyle: PropTypes.shape({}),
  contentClassName: PropTypes.string,
};
module.exports.defaultProps = {
  isOpen: false,
  closeButton: undefined,
  onClickCloseButton: null,
  refCloseButton: (() => {}),
  contentStyle: {},
  contentClassName: '',
};
