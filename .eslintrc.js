module.exports = {
  env: {
    browser: true,
    es6: true
  },
  globals: {
    chrome: 'readonly',
    $: 'readonly',
    module: 'readonly'
  },
  parserOptions: {
    ecmaFeatures: {},
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  extends: ['eslint:recommended'],
  plugins: ['crx-v3'],
  rules: {
    'crx-v3/action-unification': 'error',
    'crx-v3/manifest-version-3': 'error',
    'crx-v3/manifest-background': 'error',
    'crx-v3/manifest-permissions': 'error',
    'crx-v3/storage-apis': 'error'
  },
  overrides: [
    {
      files: ['*.json', '*.json5', '*.jsonc'],
      parser: 'jsonc-eslint-parser'
    }
  ]
}
