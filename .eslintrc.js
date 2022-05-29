/**
 * @author MrZenW
 * @email mrzenw@gmail.com, https://mrzenw.com
 * @create date 2021-05-25 13:22:31
 * @modify date 2021-07-05 11:25:26
 * @desc [description]
 */
module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:jest/recommended',
    'plugin:react/recommended',
    'airbnb',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
  },
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  globals: {
    '__webpack_public_path__': true,
    '$': true,
    'jQuery': true,
    'jquery': true,
    'alertLib': true,
    'debugLib': true,
    'lodash': true,
    'bootstrap': true,
    '__PRODUCTION__': true,
    '__DEVELOPMENT__': true,
  },
  rules: {
    'react/destructuring-assignment': 0,
    'lines-between-class-members': 0,
    // https://stackoverflow.com/questions/63961803/eslint-says-all-enums-in-typescript-app-are-already-declared-in-the-upper-scope
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    // END
    // https://stackoverflow.com/a/58835704
    'react/jsx-filename-extension': [2, { 'extensions': ['.js', '.jsx', '.ts', '.tsx'] }],
    // END
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'object-shorthand': 0,
    'prefer-arrow-callback': 0,
    'react/jsx-props-no-spreading': 0,
    'prefer-spread': 0,
    'func-names': 0,
    'prefer-object-spread': 0,
    'quote-props': 0,
    'no-constant-condition': 0,
    'dot-notation': 0,
    'prefer-rest-params': 0,
    'camelcase': 0,
    'import/extensions': 0,
    'no-nested-ternary': 0,
    'prefer-destructuring': 0,
    'prefer-const': 0,
    'no-lonely-if': 0,
    'import/prefer-default-export': 0,
    'prefer-template': 0,
    'react/jsx-boolean-value': 0,
    'no-confusing-arrow': [0, {
      allowParents: false,
    }],
    'no-underscore-dangle': 0,
    'no-param-reassign': 0,
    'no-else-return': 0,
    'class-methods-use-this': 0,
    'react/prefer-stateless-function': 0,
    'no-irregular-whitespace': 0,
    yoda: 0,
    'arrow-body-style': 0,
    'no-console': 0,
    'no-bitwise': 0,
    'max-len': 0,

    'jsx-a11y/href-no-hash': 'off',
    'jsx-a11y/label-has-for': 'off',
    'jsx-a11y/anchor-is-valid': ['warn', {
      'aspects': ['invalidHref'],
    }],
    'quotes': [
      'error',
      'single',
      {
        'avoidEscape': true,
        'allowTemplateLiterals': true,
      },
    ],
  },
  'settings': {
    'import/resolver': {
      webpack: { // require to install: https://www.npmjs.com/package/eslint-import-resolver-webpack
        config: 'webpack.common.js',
        'babel-module': {},
      },
    },
  },
};
