/**
 * @author MrZenW
 * @email mrzenw@gmail.com, https://mrzenw.com
 * @create date 2021-05-25 13:10:50
 * @modify date 2021-05-25 13:10:50
 * @desc [description]
 */
const React = require('react');
const PropTypes = require('prop-types');

const component = (props) => {
  const { style, elementRef, children } = props;
  return (
    <div
      style={style}
      ref={elementRef}
    >
      {children(Object.assign({}, props))}
    </div>
  );
};
component.propTypes = {
  style: PropTypes.shape({}),
  viewAwext: PropTypes.shape({}).isRequired,
  frameViewAwext: PropTypes.shape({}).isRequired,
  elementRef: PropTypes.shape({}).isRequired,
  children: PropTypes.func.isRequired,
};
component.defaultProps = {
  style: {},
};

module.exports = component;
