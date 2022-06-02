/**
 * @author MrZenW
 * @email mrzenw@gmail.com, https://mrzenw.com
 * @create date 2021-05-25 13:09:08
 * @modify date 2021-05-25 13:09:08
 * @desc [description]
 */
const React = require('react');
const PropTypes = require('prop-types');

const EmbedContext = React.createContext({});

const Embed = (props) => {
  const { embedTest, embedFactor } = props;
  let matched = null;
  if (typeof embedTest === 'function') {
    matched = embedTest(props);
  } else if (embedTest instanceof RegExp) {
    matched = embedTest.exec(embedFactor);
  } else if (embedFactor === embedTest) {
    matched = embedFactor;
  }
  const { embedComponent: Component, children } = props;
  if (matched) {
    // componentProps['embedMatched'] = matched;
    return (
      <EmbedContext.Provider value={{ embedTest, embedFactor, embedMatched: matched }}>
        <Component {...props}>
          {children}
        </Component>
      </EmbedContext.Provider>
    );
  } else {
    return <></>;
  }
};

Embed.propTypes = {
  embedFactor: PropTypes.string,
  embedTest: PropTypes.oneOfType([PropTypes.func, PropTypes.string, PropTypes.instanceOf(RegExp)]).isRequired,
  embedComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]).isRequired,
};
Embed.defaultProps = {
  embedFactor: '',
};

exports.Embed = Embed;
exports.EmbedContext = EmbedContext;
