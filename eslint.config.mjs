import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default defineConfig([
  globalIgnores(['node_modules/', 'dist/']),
  eslint.configs.recommended,
  prettierConfig,
  {
    languageOptions: {
      globals: {
        ...globals.node, // Esto define process, console, etc.
      },
    },
  },
]);
