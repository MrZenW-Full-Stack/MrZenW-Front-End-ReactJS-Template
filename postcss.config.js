/**
 * @author MrZenW
 * @email MrZenW@gmail.com, https://MrZenW.com
 * @create date 2021-05-25 13:22:17
 * @modify date 2021-05-25 13:22:17
 * @desc [description]
 */
/* eslint-disable */

// const cssnano = require('cssnano')

const postcssImport = require('postcss-import');
const postcssUrl = require('postcss-url');
const postcssNesting = require('postcss-nesting');
const postcssSimpleExtend = require('postcss-simple-extend');
const postcssCssnext = require('postcss-cssnext');

module.exports = ({
  plugins: [
    postcssImport(),
    postcssUrl(),
    postcssNesting(),
    postcssSimpleExtend(),
    postcssCssnext({ browsers: ['last 3 versions'] }),
  ],
});
