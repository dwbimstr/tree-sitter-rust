import treesitter from 'eslint-config-treesitter';

export default [
  ...treesitter.map(config => ({...config, files: ['grammar.mjs']})),
  {
    files: ['grammar.mjs'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        rule: 'readonly',
        override: 'readonly',
        external: 'readonly',
        RustRegex: 'readonly',
      },
    },
    rules: {
      // Exported grammar bindings use Rust node names, including underscores.
      camelcase: 'off',
      // Rules are a comma-separated declaration list, aligned by rule name.
      'one-var': 'off',
      indent: ['error', 2, {SwitchCase: 1, VariableDeclarator: 0}],
    },
  },
];
