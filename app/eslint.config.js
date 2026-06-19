import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // Allow `_`-prefixed args/vars as intentional placeholders (service stubs).
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      // Co-locating hooks/types with their provider is intentional here; HMR-only concern.
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // We intentionally sync persisted queue state into React on mount (post-await).
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
  {
    // Node tooling scripts.
    files: ['scripts/**/*.mjs'],
    languageOptions: { globals: globals.node },
  },
])
