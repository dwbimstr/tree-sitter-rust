import treesitter from 'eslint-config-treesitter';

export default [
  ...treesitter.map(config => ({...config, files: ['grammar.mjs']})),
  {
    files: ['grammar.mjs'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        rule: 'readonly',
        external: 'readonly',
        RustRegex: 'readonly',
      },
    },
    rules: {
      // Exported grammar bindings use Rust node names, including underscores.
      camelcase: 'off',
      // Allow comma-separated rule declarations.
      'one-var': 'off',
    },
  },
];
