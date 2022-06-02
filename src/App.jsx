/**
 * @author MrZenW
 * @email MrZenW@gmail.com, https://MrZenW.com
 * @create date 2021-05-25 13:21:33
 * @modify date 2021-05-25 13:21:33
 * @desc [description]
 */
require('$/services/config_service');
const React = require('react');
const { URLHashEmbed } = require('./components/embeder/url-hash-embed');
const { URLHashSelector } = require('./components/embeder/url-hash-selector');
const pages = require('./pages');

exports.App = () => {
  return (
    <URLHashSelector>
      <URLHashEmbed embedTest={/^\/+$/} embedComponent={pages.Page1View} />
      <URLHashEmbed embedTest={/^\/page_1$/} embedComponent={pages.Page1View} />
      <URLHashEmbed embedTest={/^\/page_2$/} embedComponent={pages.Page2View} />
      <URLHashEmbed embedTest={/(.*)/} embedComponent={pages.Error404} />
    </URLHashSelector>
  );
};
