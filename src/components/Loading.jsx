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

// const log = console.log.bind(console);

const styles = {
  fontSize: '1.5em',
  width: '100%',
  height: '100%',
};

module.exports = (props) => {
  const { children, style, randomTexts } = props;
  const currentMinute = new Date().getMinutes();
  const hungryIdx = (currentMinute % 7) + 1;
  const [hungryId] = React.useState(hungryIdx);
  const [currentText, setCurrentText] = React.useState('');
  if (randomTexts && randomTexts.length) {
    React.useEffect(() => {
      const func = () => {
        const theText = randomTexts[parseInt(Math.random() * randomTexts.length, 10)];
        setCurrentText(theText);
      };
      func();
      const handle = setInterval(func, 10 * 1e3);
      return () => {
        clearInterval(handle);
      };
    }, []);
  }

  return (
    <div style={Object.assign({}, styles, style)} className="component-loading d-flex align-items-center justify-content-center">
      <div style={{ textAlign: 'center' }}>
        {/* <img style={{ width: '2em' }} src={loading_spinner} alt="loading" /> */}
        <div style={{ marginLeft: 'auto', marginRight: 'auto' }} className={'hungry-' + hungryId} />
        <p>
          {children}
        </p>
        {currentText && (
          <p>
            {currentText}
          </p>
        )}
      </div>
    </div>
  );
};
module.exports.propTypes = {
  children: PropTypes.node,
  // children: PropTypes.oneOfType([
  //   PropTypes.string,
  //   PropTypes.number,
  //   PropTypes.node,
  // ]),
  style: PropTypes.shape({}),
  randomTexts: PropTypes.arrayOf(PropTypes.string),
};
module.exports.defaultProps = {
  children: 'Loading...',
  style: {},
  randomTexts: [],
};
