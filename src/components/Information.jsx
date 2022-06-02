/**
 * @author MrZenW
 * @email MrZenW@gmail.com, https://MrZenW.com
 * @create date 2021-05-25 13:11:34
 * @modify date 2021-05-25 13:11:34
 * @desc [description]
 */
const React = require('react');
const PropTypes = require('prop-types');
// const loading_spinner = require('$/assets/images/loading_spinner.gif');

const styles = {
  fontSize: '1.5em',
  width: '100%',
  height: '100%',
};

module.exports = (props) => {
  const { children, style } = props;
  return (
    <div style={Object.assign({}, styles, style)} className="component-information d-flex align-items-center justify-content-center">
      <div style={{ textAlign: 'center' }}>
        <div style={{ marginLeft: 'auto', marginRight: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
};
module.exports.propTypes = {
  children: PropTypes.node.isRequired,
  // children: PropTypes.oneOfType([
  //   PropTypes.string,
  //   PropTypes.number,
  //   PropTypes.node,
  // ]),
  style: PropTypes.shape({}),
};
module.exports.defaultProps = {
  style: {},
};
