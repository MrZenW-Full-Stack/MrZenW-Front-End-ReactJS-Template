/**
 * @author MrZenW
 * @email MrZenW@gmail.com, https://MrZenW.com
 * @create date 2021-05-25 13:09:36
 * @modify date 2021-05-25 13:09:36
 * @desc [description]
 */
const React = require('react');
const PropTypes = require('prop-types');
const { Embed } = require('./embed');
const { historyAwext } = require('./history_awext');

exports.URLHashEmbed = (props) => {
  const { embedTest, embedComponent, children } = props;
  const embedProps = Object.assign({}, props, {
    embedTest,
    embedFactor: historyAwext.hashPathname,
    embedComponent,
  });
  return (
    <Embed {...embedProps}>
      {children}
    </Embed>
  );
};
module.exports.propTypes = {
  embedTest: PropTypes.oneOfType([PropTypes.func, PropTypes.string, PropTypes.instanceOf(RegExp)]).isRequired,
  embedComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]).isRequired,
};
