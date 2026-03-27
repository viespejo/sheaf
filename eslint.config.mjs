import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier';

export default defineConfig([
  globalIgnores(['node_modules/', 'dist/']),
  eslint.configs.recommended,
  prettierConfig,
]);
