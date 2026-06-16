import { defineConfig, globalIgnores } from 'eslint/config'
import wc from '@open-wc/eslint-config'
import prettier from 'eslint-config-prettier'

export default defineConfig([
  globalIgnores([
    'packages/rdf-editor/src/mode/',
    'node_modules',
    'coverage/',
    'dist/',
    '*.cjs',
    '*.d.ts',
  ]),
  wc,
  prettier,
  {
    files: ['**/*.config.js'],
    rules: {
      'import-x/no-extraneous-dependencies': 'off',
    },
  },
])
