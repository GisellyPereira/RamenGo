import globals from 'globals';
import pluginJs from '@eslint/js';
export default [
  { ignores: ['dist/**', 'node_modules/**', 'js/modules/**', 'api.js'] },
  pluginJs.configs.recommended,
  { files: ['js/**/*.js'], languageOptions: { globals: globals.browser } },
  { files: ['*.cjs'], languageOptions: { globals: globals.node } },
];
