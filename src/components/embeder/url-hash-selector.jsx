/**
 * @author MrZenW
 * @email MrZenW@gmail.com, https://MrZenW.com
 * @create date 2021-05-25 13:09:41
 * @modify date 2021-05-25 13:09:41
 * @desc [description]
 */
const React = require('react');
const { useAwext } = require('$/awext/core');
const { historyAwext } = require('./history_awext');

exports.URLHashSelector = (props) => {
  useAwext({ props }, (inputArgs, forceUpdate, thisAwext) => {
    thisAwext.awextRegisterUnwatch(historyAwext.awextOn('pushstate', forceUpdate));
    thisAwext.awextRegisterUnwatch(historyAwext.awextOn('popstate', forceUpdate));
    thisAwext.awextRegisterUnwatch(historyAwext.awextOn('hashchange', forceUpdate));
    return () => {
      thisAwext.awextDiscard();
    };
  }, React);
  const { children } = props;
  const childrenArray = (Array.isArray(children)) ? children : [children];
  const { hash } = window.location;
  // console.log(children, 'children');
  return (
    <>
      {childrenArray.find((c) => {
        let matched = null;
        if (typeof c === 'object' && typeof c.props === 'object') {
          const embedFactor = hash.slice(1);
          const { embedTest } = c.props;
          if (embedTest instanceof RegExp) {
            matched = embedTest.exec(embedFactor);
          } else if (typeof embedTest === 'function') {
            matched = embedTest();
          } else if (embedFactor === embedTest) {
            matched = embedFactor;
          }
        }
        return !!matched;
      })}
    </>
  );
};
