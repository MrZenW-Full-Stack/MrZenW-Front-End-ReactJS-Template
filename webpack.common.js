/**
 * @author MrZenW
 * @email mrzenw@gmail.com, https://mrzenw.com
 * @create date 2021-05-25 13:21:54
 * @modify date 2021-09-21 10:47:05
 * @desc [description]
 */

/* eslint-disable import/no-extraneous-dependencies */

/**
 * Define common configuration for Webpack
 * @see https://webpack.js.org/guides/production/
 * @type {webpack}
 */
// https://node.green/#ES2020-features-globalThis

const now = Date.now();
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
// const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { join, resolve } = require('path');
const os = require('os');

const envKeeper = require('./dev_tools/env-keeper');

const rules = require('./webpack.rules');
const { WebpackAuthorPlugin } = require('./dev_tools/webpack_author_plugin');
// const { ipAddress } = require('./dev_tools/ip_address');
// const moment = require('moment');

console.log('All the Env:', process.env);

envKeeper.checkSync((e) => {
  if (e) {
    console.error(e);
    process.exit(400);
  }
});

const srcFolder = resolve(__dirname, 'src');

console.log('Building with %O', {
  NODE_ENV: process.env.NODE_ENV,
});

if (process.env.NODE_ENV === 'development') {
  // process.env.MQTT_HOST = `ws://${ipAddress}:9001`;
}
const { MQTT_HOST } = process.env;
const {
  APP_VERSION,
  APP_PUBLIC_BIN_DIR,
  API_BASEURL,
  GOOGLE_RECAPTCHA_SITE_KEY,
  GOOGLE_OAUTH_CLIENT_ID,
} = process.env;
console.log(`API_BASEURL : ${API_BASEURL}`);
console.log(`MQTT_HOST : ${MQTT_HOST}`);
console.log(`GOOGLE_RECAPTCHA_SITE_KEY : ${GOOGLE_RECAPTCHA_SITE_KEY}`);
console.log(`GOOGLE_OAUTH_CLIENT_ID : ${GOOGLE_OAUTH_CLIENT_ID}`);

module.exports = merge({}, rules, {
  // entry: ['@babel/polyfill', srcFolder],
  entry: {
    // sandbox_worker: [
    //   '@babel/polyfill',
    //   'raven-js',
    //   'lodash',
    //   'mqtt',
    //   [srcFolder, 'sandbox_worker', 'sandbox_worker.js'].join('/')],
    main: [
      // '@babel/polyfill',
      srcFolder,
    ],
  },
  // node: {
  //   fs: 'empty',
  // },
  plugins: [
    new NodePolyfillPlugin(),
    new MiniCssExtractPlugin({
      // filename: 'styles/[name]-[fullhash].css',
      // chunkFilename: 'styles/[id]-[chunkhash].css',
      filename: APP_PUBLIC_BIN_DIR + '/[name]-[fullhash].css',
      chunkFilename: APP_PUBLIC_BIN_DIR + '/[id]-[chunkhash].css',
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.EnvironmentPlugin(Object.assign(
      {},
      process.env,
      {
        NODE_ENV: process.env.NODE_ENV || 'development',
        APP_PUBLIC_BIN_DIR: APP_PUBLIC_BIN_DIR,
        MQTT_HOST: process.env.MQTT_HOST || '',
        API_BASEURL: API_BASEURL || '',
        APP_VERSION: APP_VERSION || process.env.APP_VERSION || process.env.CI_COMMIT_TAG || 'unknown',
        SENTRY_DSN: process.env.SENTRY_DSN || '',
        SENTRY_DSN_TEST: process.env.SENTRY_DSN_TEST || '',
        GOOGLE_RECAPTCHA_SITE_KEY: GOOGLE_RECAPTCHA_SITE_KEY || '',
        GOOGLE_OAUTH_CLIENT_ID: GOOGLE_OAUTH_CLIENT_ID || '',
        STATIC_STORAGE_BASE_URL: process.env.STATIC_STORAGE_BASE_URL || '',
        BUILD_ENV_OS_HOSTNAME: os.hostname(),
        BUILD_ENV_OS_PLATFORM: os.platform(),
        BUILD_ENV_OS_TYPE: os.type(),
        BUILD_TIMESTAMP: `${now}`,
        BUILD_DATETIME: (new Date(now)).toLocaleString('en-GB', { timeZone: 'Pacific/Auckland' }),
      },
    )),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      alertLib: '$/libraries/alert_lib',
      debugLib: '$/libraries/debug_lib',
      lodash: 'lodash',
      bootstrap: 'bootstrap/dist/js/bootstrap',

      Buffer: ['buffer', 'Buffer'],
      process: 'process',
      Promise: 'bluebird',
      'window.Promise': 'bluebird',

      setImmediate: ['$/libraries/set_immediate', 'setImmediate'],
      'window.setImmediate': ['$/libraries/set_immediate', 'setImmediate'],
      clearImmediate: ['$/libraries/set_immediate', 'clearImmediate'],
      'window.clearImmediate': ['$/libraries/set_immediate', 'clearImmediate'],
    }),
    new HtmlWebpackPlugin({
      favicon: resolve(srcFolder, 'favicon.ico'),
      template: resolve(srcFolder, 'index.tpl.html'),
      minify: { collapseWhitespace: true },
      chunksSortMode(a, b) {
        const entryPoints = [
          'inline', 'polyfills', 'sw-register', 'styles', 'vendor', 'main', 'js',
        ];
        return entryPoints.indexOf(a.names[0]) - entryPoints.indexOf(b.names[0]);
      },
    }),
    new HtmlWebpackPlugin({
      filename: 'head.html',
      // favicon: resolve(srcFolder, 'favicon.ico'),
      // template: resolve(srcFolder, 'head.tpl.html'),
      minify: { collapseWhitespace: true },
      chunksSortMode(a, b) {
        const entryPoints = [
          'inline', 'polyfills', 'sw-register', 'styles', 'vendor', 'main', 'js',
        ];
        return entryPoints.indexOf(a.names[0]) - entryPoints.indexOf(b.names[0]);
      },
      templateContent: '',
      // templateContent(arg) {
      //   const {
      //     htmlWebpackPlugin,
      //     // webpackConfig,
      //   } = arg;
      //   // https://github.com/jantimon/html-webpack-plugin
      //   // console.log(htmlWebpackPlugin.tags.headTags, 'bbb');
      //   // console.log(htmlWebpackPlugin.options.templateContent === templateContent, 'aaaaaaa');
      //   // const outputPath = webpackConfig.output.path;
      //   // const c = htmlWebpackPlugin.options;
      //   // console.log(c, path, 'aaaa');
      //   return JSON.stringify(htmlWebpackPlugin.tags.headTags);
      // },
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: join(__dirname, 'humans.txt'), to: '' },
        // { from: join(srcFolder, 'src-directory'), to: join(APP_PUBLIC_BIN_DIR, 'destination-directory/') },
      ],
    }),
    new webpack.DllReferencePlugin({
      context: join(__dirname, 'dist'),
      // eslint-disable-next-line global-require, import/no-dynamic-require
      manifest: require('./dist/' + APP_PUBLIC_BIN_DIR + '/mrzenwdotcom-vendor-manifest.json'),
      // manifest: require('./dist/vendor-manifest.json'),
    }),
    new WebpackAuthorPlugin(),
  ],
  resolve: {
    // fallback: {
    //   fs: false,
    // },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: {
      // '$/pages': resolve(srcFolder, 'pages'),
      '$/blocks': resolve(srcFolder, 'blocks'),
      '$/components': resolve(srcFolder, 'components'),
      '$/awext': resolve(srcFolder, 'awext'),
      '$/libraries': resolve(srcFolder, 'libraries'),
      '$/services': resolve(srcFolder, 'services'),
      '$/assets': resolve(srcFolder, 'assets'),
      '$$/apis': resolve(srcFolder, 'services', 'api_service', 'apis'),
    },
  },
});
