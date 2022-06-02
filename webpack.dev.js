/**
 * @author MrZenW
 * @email MrZenW@gmail.com, https://MrZenW.com
 * @create date 2021-05-25 13:22:02
 * @modify date 2021-09-08 16:13:20
 * @desc [description]
 */

/* eslint-disable import/no-extraneous-dependencies */

const webpack = require('webpack');
const { merge } = require('webpack-merge');
const path = require('path');
const TesrerPlugin = require('terser-webpack-plugin');
const common = require('./webpack.common.js');

const { APP_PUBLIC_BIN_DIR } = process.env;

const tesrerPlugin = new TesrerPlugin({
  parallel: true,
  terserOptions: {
    ecma: 8,
    sourceMap: true,
    keep_classnames: false,
    keep_fnames: false,
    warnings: true,
    compress: {
      // warnings: false,
      // drop_console: true,
      drop_console: false,
      drop_debugger: false,
    },
    output: {
      comments: false,
    },
  },
});

module.exports = merge({}, common, {
  mode: 'development',
  devtool: 'eval-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/', // this option is used for js file
    filename: APP_PUBLIC_BIN_DIR + '/[name]-[fullhash].bundle.js',
    // chunkFilename: '[name]-[fullhash].js',
    // sourceMapFilename: '[name]-[fullhash].js.map',
    chunkFilename: APP_PUBLIC_BIN_DIR + '/[name]-[fullhash].js',
    sourceMapFilename: '[path][name]-[fullhash][ext].map',
    pathinfo: true,
    globalObject: 'this',
    // fixed [WebWorker `window is not defined`] by  https://github.com/webpack/webpack/issues/6642
    //           https://github.com/webpack-contrib/worker-loader/issues/142
  },
  plugins: [
    new webpack.DefinePlugin({
      __PRODUCTION__: false,
      __DEVELOPMENT__: true,
      'process.browser': 'true',
    }),
    // new webpack.NamedModulesPlugin(),
    // new webpack.HashedModuleIdsPlugin(),
    // new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  optimization: {
    // moduleIds: 'named', // replace new webpack.NamedModulesPlugin(),
    moduleIds: 'deterministic',
    minimize: false,
    minimizer: [
      tesrerPlugin,
    ],
  },
  // resolve: {
  //   alias: {
  //     'react-dom': '@hot-loader/react-dom',
  //   },
  // },
  profile: true,
  stats: {
    // Display bailout reasons
    errorDetails: true,
    optimizationBailout: true,
    children: true,
  },
});
