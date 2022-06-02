/**
 * @author MrZenW
 * @email MrZenW@gmail.com, https://MrZenW.com
 * @create date 2021-05-25 13:22:08
 * @modify date 2021-09-08 17:42:31
 * @desc [description]
 */

/* eslint-disable import/no-extraneous-dependencies */

const { resolve, join } = require('path');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const srcFolder = resolve(__dirname, 'src');

process.env.APP_VERSION = process.env.APP_VERSION || process.env.CI_COMMIT_TAG || 'version_unknown';
process.env.APP_PUBLIC_DIR = process.env.APP_PUBLIC_DIR || '_mrzenw.com_';
process.env.APP_PUBLIC_BIN_DIR = join(process.env.APP_PUBLIC_DIR, process.env.APP_VERSION);
const { APP_PUBLIC_BIN_DIR } = process.env;

module.exports = {
  module: {
    rules: [
      // raw
      {
        test: /.*/,
        resourceQuery: /raw-loader=true/i,
        loader: 'raw-loader',
        options: {
          esModule: false,
        },
      },
      {
        test: /\.web_worker\.js$/i,
        use: { loader: 'worker-loader' },
      },
      {
        test: /\.(jsx?)$/i,
        include: [srcFolder],
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            configFile: resolve(__dirname, 'babel.config.js'),
          },
        },
      },
      {
        test: /\.(tsx?)$/i,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        oneOf: [
          {
            resourceQuery: /noPostcss/i,
            use: [
              MiniCssExtractPlugin.loader,
              {
                // Interprets `@import` and `url()` like `import/require()` and will resolve them
                loader: 'css-loader',
              },
              // {
              //   // Loader for webpack to process CSS with PostCSS
              //   loader: 'postcss-loader',
              //   options: {
              //     postcssOptions: {
              //       plugins: () => {
              //         return [autoprefixer];
              //       },
              //     },
              //   },
              // },
            ],
          },
          {
            resourceQuery: /.*/,
            use: [
              MiniCssExtractPlugin.loader,
              {
                // Interprets `@import` and `url()` like `import/require()` and will resolve them
                loader: 'css-loader',
              },
              {
                // Loader for webpack to process CSS with PostCSS
                loader: 'postcss-loader',
                options: {
                  postcssOptions: {
                    plugins: () => {
                      return [autoprefixer];
                    },
                  },
                },
              },
            ],
          },
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            // Interprets `@import` and `url()` like `import/require()` and will resolve them
            loader: 'css-loader',
          },
          {
            // Loader for webpack to process CSS with PostCSS
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: () => {
                  return [autoprefixer];
                },
              },
            },
          },
          {
            // Loads a SASS/SCSS file and compiles it to CSS
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.xml$/i,
        loader: 'raw-loader',
        options: {
          esModule: false,
        },
        include: [
          join(srcFolder, 'pages', 'playground', 'blockly_workspace', 'block_toolbox'),
        ],
      },
      {
        test: /\.jpe?g$|\.gif$|\.ico$|\.png$|\.svg$/i,
        use: `file-loader?esModule=false&name=${APP_PUBLIC_BIN_DIR}/assets/[path][name].[ext]?[hash]`,
      },
      {
        test: /\.wav$|\.mp3$/i,
        use: `file-loader?esModule=false&name=${APP_PUBLIC_BIN_DIR}/assets/[path][name].[ext]?[hash]`,
      },
      {
        test: /\.fnt$/i,
        use: `file-loader?esModule=false&name=${APP_PUBLIC_BIN_DIR}/assets/[path][name].[ext]?[hash]`,
      },
    ],
  },
};
