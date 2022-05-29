/**
 * @author MrZenW
 * @email mrzenw@gmail.com, https://mrzenw.com
 * @create date 2021-05-25 13:22:22
 * @modify date 2021-05-25 13:22:23
 * @desc [description]
 */
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        loose: true,
        useBuiltIns: 'usage',
        corejs: '3.9',
        modules: false,
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-transform-classes',
    '@babel/plugin-syntax-dynamic-import',
    [
      '@babel/plugin-transform-react-jsx',
      {
        useBuiltIns: true,
      },
    ],
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true,
      },
    ],
    [
      '@babel/plugin-proposal-class-properties',
      {
        loose: true,
      },
    ],
  ],
  env: {
    test: {
      plugins: ['@babel/plugin-transform-modules-commonjs'],
    },
    development: {
      sourceMaps: true,
      plugins: ['@babel/plugin-transform-modules-commonjs'],
    },
    production: {
      plugins: [
        '@babel/plugin-transform-modules-commonjs',
        '@babel/plugin-transform-react-inline-elements',
        '@babel/plugin-transform-react-constant-elements',
        [
          'transform-react-remove-prop-types',
          {
            'mode': 'wrap',
            'ignoreFilenames': ['node_modules'],
          },
        ],
      ],
    },
  },
};
