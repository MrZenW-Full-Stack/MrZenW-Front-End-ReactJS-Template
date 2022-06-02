/**
 * @author MrZenW
 * @email MrZenW@gmail.com, https://MrZenW.com
 * @create date 2021-05-25 13:21:59
 * @modify date 2021-10-18 11:01:24
 * @desc [description]
 */

/* eslint-disable import/no-extraneous-dependencies */

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const { resolve } = require('path');
const chalk = require('chalk');
const webpackConfig = require('./webpack.dev.js');
const { ipAddress } = require('./dev_tools/ip_address');
// let initialCompile = true;
const compiler = webpack(webpackConfig);

let serverHost = '0.0.0.0';
serverHost = `${ipAddress}`;
// serverHost = '25.14.95.187';

const host = serverHost;
const port = 4001;
const isSecure = false;
const apiPort = 30281;
const apiProxy = `http://${host}:${apiPort}`;

const apiPhpPort = 30282;
const apiPhpProxy = `http://${host}:${apiPhpPort}`;

const srcFolder = resolve(__dirname, 'src');

const devServerProtocol = isSecure ? 'https' : 'http';

function printDevServerInfo() {
  console.log(`Server host : ${chalk.black.bgWhite(devServerProtocol + '://' + host)}`);
  console.log(`Server port : ${chalk.black.bgWhite(port)}`);
  console.log(`🔗 Please visit: [ ${chalk.black.bgWhite(devServerProtocol + '://' + host + ':' + port)} ]`);
  console.log(`Server apiPort : ${apiPort}`);
  console.log(`Server apiProxy : ${apiProxy}`);
  console.log(`Server apiPhpProxy : ${apiPhpProxy}`);
  console.log(`Server srcFolder : ${srcFolder}`);
}

const devServer = new WebpackDevServer(compiler, {
  // publicPath: webpackConfig.output.publicPath,
  // inline: true,
  // inline: false,
  host,
  port,
  https: isSecure,
  compress: true,
  allowedHosts: [
    `${host}.xip.io`,
    `${host}.nip.io`,
  ],
  client: {
    logging: 'error',
    overlay: {
      warnings: true,
      errors: true,
    },
  },
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
  },
  // hot: 'only',
  hot: false,
  liveReload: false,
  historyApiFallback: true,
  proxy: {
    // '/static/**': apiProxy, // online server's linux folder is /var/www/static/
    '/api/**': apiProxy,
  },
  static: {
    directory: resolve(__dirname, 'static'),
    publicPath: '/static',
    staticOptions: {
      maxAge: '1d',
      // setHeaders: (res) => {
      //   const lifetimeMS = (1 * 24 * 60 * 60 * 1e3);
      //   res.set('Cache-Control', 'public, max-age=' + parseInt(lifetimeMS / 1000, 10));
      //   res.set('Expires', new Date(Date.now() + lifetimeMS).toUTCString());
      // },
      // redirect: resolve(__dirname, 'static'),
    },
  },
  // stats: 'errors-only',
  // stats: {
  //   colors: true,
  //   modules: true,
  //   reasons: true,
  //   errorDetails: true,
  // },
});

devServer.listen(port, host, (err) => {
  if (err) console.error(err);
  console.log('Starting ... ');
});
compiler.hooks.done.tap('MyPlugin', () => {
  // if (initialCompile) {
  //   initialCompile = false;
  console.log(`=>🟢 Development server is running on ${chalk.black.bgWhite(devServerProtocol + '://' + host + ':' + port)}`);
  console.log(`=>🟢 Proxy to API ${chalk.black.bgWhite(apiProxy)}`);
  printDevServerInfo();
  // }
});
// compiler.plugin('done', () => {
//   if (initialCompile) {
//     initialCompile = false;
//     debug(`=> Development server is running on ${host}:${port}`);
//     debug(`=> Proxy to API ${apiProxy}`);
//   }
// });
