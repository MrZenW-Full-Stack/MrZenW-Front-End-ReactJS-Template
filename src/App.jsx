/**
 * @author MrZenW
 * @email mrzenw@gmail.com, https://mrzenw.com
 * @create date 2021-05-25 13:21:33
 * @modify date 2021-05-25 13:21:33
 * @desc [description]
 */
require('$/services/config_service');
const React = require('react');
const { URLHashEmbed } = require('./components/embeder/url-hash-embed');
const { URLHashSelector } = require('./components/embeder/url-hash-selector');
const pages = require('./pages');

module.exports = () => {
  return (
    <URLHashSelector>
      <URLHashEmbed embedTest={/^\/$/} embedComponent={pages.homepage} />
      
      <URLHashEmbed embedTest={/(.*)/} embedComponent={pages.error404} />
    </URLHashSelector>
  );
};
