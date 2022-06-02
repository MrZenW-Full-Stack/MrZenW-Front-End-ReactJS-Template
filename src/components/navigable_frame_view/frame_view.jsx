/**
 * @author MrZenW
 * @email MrZenW@gmail.com, https://MrZenW.com
 * @create date 2021-05-25 13:10:39
 * @modify date 2021-05-25 13:10:39
 * @desc [description]
 */
const React = require('react');
const PropTypes = require('prop-types');
const { useAwext } = require('$/awext/core');
const actions = require('./actions.frame_view');
const context = require('./context');

const component = (props) => {
  const awext = useAwext({ props }, actions, React);
  const {
    currentViewPath,
    currentViewAwext,
    previousViewPath,
    previousViewAwext,
  } = awext;
  let _previousView = null;
  if (previousViewAwext) {
    _previousView = (
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: '0px',
          left: '0px',
          overflow: 'hidden',
        }}
        ref={awext._receivePreviousViewContainer}
      >
        <previousViewAwext.View
          key={previousViewPath.join(',') + '|' + previousViewAwext.viewKey}
          viewAwext={previousViewAwext}
          frameViewAwext={awext}
        />
      </div>
    );
  }
  let _currentView = null;
  if (currentViewAwext) {
    _currentView = (
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: '0px',
          left: '0px',
          overflow: 'hidden',
        }}
        ref={awext._receiveCurrentViewContainer}
      >
        <currentViewAwext.View
          key={currentViewPath.join(',') + '|' + currentViewAwext.viewKey}
          viewAwext={currentViewAwext}
          frameViewAwext={awext}
        />
      </div>
    );
  }
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        top: '0px',
        left: '0px',
        overflow: 'hidden',
      }}
    >
      <context.Provider
        value={{
          currentViewAwext,
          currentViewPath,
          isPrevious: true,
          frameViewAwext: awext,
          viewAwext: previousViewAwext,
          viewPath: previousViewPath,
        }}
      >
        {_previousView}
      </context.Provider>
      <context.Provider
        value={{
          previousViewAwext,
          previousViewPath,
          isCurrent: true,
          frameViewAwext: awext,
          viewAwext: currentViewAwext,
          viewPath: currentViewPath,
        }}
      >
        {_currentView}
      </context.Provider>
    </div>
  );
};
component.propTypes = {
  initViewAwext: PropTypes.shape({}).isRequired,
  currentViewPath: PropTypes.arrayOf(PropTypes.string).isRequired,
};

module.exports = component;
