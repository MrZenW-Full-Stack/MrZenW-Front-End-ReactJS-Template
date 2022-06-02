/**
 * @author MrZenW
 * @email MrZenW@gmail.com, https://MrZenW.com
 * @create date 2021-05-25 13:22:11
 * @modify date 2021-08-27 14:54:31
 * @desc [description]
 */

/* eslint-disable import/no-extraneous-dependencies */

const { join, resolve } = require('path');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const { merge } = require('webpack-merge');
const rules = require('./webpack.rules');

const { APP_PUBLIC_BIN_DIR } = process.env;

module.exports = merge({}, rules, {
  mode: 'production',
  entry: {
    vendor: [
      'statecore',
      'bootstrap',
      'jquery',
      'react',
      'react-dom',
      'lodash',
      'sweetalert2',
      // 'mqtt',
    ],
  },

  output: {
    path: resolve(__dirname, 'dist', APP_PUBLIC_BIN_DIR),
    filename: 'mrzenwdotcom-vendor-[fullhash].bundle.js',
    chunkFilename: 'mrzenwdotcom-vendor-[fullhash].js',
    library: '[name]',
  },

  plugins: [
    new webpack.DllPlugin({
      context: __dirname,
      name: '[name]',
      path: join(__dirname, 'dist', APP_PUBLIC_BIN_DIR, 'mrzenwdotcom-vendor-manifest.json'),
    }),
    new CompressionPlugin({
      filename: '[path][base].gz[query]',
      algorithm: 'gzip',
      test: /\.(js|html)$/i,
      threshold: 10240,
      minRatio: 0.8,
    }),
  ],
});
