/**
 * @author MrZenW
 * @email mrzenw@gmail.com, https://mrzenw.com
 * @create date 2021-05-25 13:22:05
 * @modify date 2021-09-08 15:58:41
 * @desc [description]
 */

/* eslint-disable import/no-extraneous-dependencies */

const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const CompressionPlugin = require('compression-webpack-plugin');
const TesrerPlugin = require('terser-webpack-plugin');
const common = require('./webpack.common.js');

const {
  APP_PUBLIC_BIN_DIR,
} = process.env;

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
  mode: 'production',
  devtool: 'source-map',
  // devtool: 'eval-source-map',
  optimization: {
    minimize: true,
    minimizer: [
      tesrerPlugin,
    ],
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
    runtimeChunk: true,
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    // publicPath: '//the-CDN-domain:port/',
    publicPath: '/',
    filename: APP_PUBLIC_BIN_DIR + '/[name]-[fullhash].bundle.js',
    // chunkFilename: '[name]-[fullhash].js',
    // sourceMapFilename: '[path][name]-[fullhash][ext].map',
    // sourceMapFilename: '[fullhash]-[hash]-[id]-[name]-[chunkhash]-[contenthash]-[file]-[base]-[path].map',
    // sourceMapFilename: function () {
    //   console.log(arguments, 'aaaa');
    //   return Math.random() + '.js';
    // },
    chunkFilename: APP_PUBLIC_BIN_DIR + '/[name]-[fullhash].js',
    // sourceMapFilename: APP_PUBLIC_BIN_DIR + '/source-map/[name]-[fullhash][ext].map',
    sourceMapFilename: APP_PUBLIC_BIN_DIR + '/[name]-[fullhash][ext].map',
  },
  plugins: [
    new webpack.DefinePlugin({
      __PRODUCTION__: true,
      __DEVELOPMENT__: false,
      'process.browser': 'true',
    }),
    new CompressionPlugin({
      filename: '[path][base].gz[query]',
      algorithm: 'gzip',
      test: /\.(js|html)$/i,
      threshold: 10240,
      minRatio: 0.8,
    }),
  ],
  stats: {
    errorDetails: true,
    optimizationBailout: true,
    children: true,
  },
});
