import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    files: ['**/*.js'],
    languageOptions: { ecmaVersion: 2020, sourceType: 'module', globals: globals.browser },
    rules: {
      ...js.configs.recommended.rules,
    },
  },
])


