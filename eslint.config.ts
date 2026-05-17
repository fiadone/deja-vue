import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import perfectionist from 'eslint-plugin-perfectionist'
import unusedImports from 'eslint-plugin-unused-imports'
import vue from 'eslint-plugin-vue'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.vitepress/cache/**',
      '**/.vitepress/dist/**',
      '**/.vitepress/.temp/**'
    ]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    files: ['**/*.{ts,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
        ...globals.node,
        gsap: 'readonly'
      },
      parserOptions: {
        extraFileExtensions: ['.vue'],
        parser: tseslint.parser,
        sourceType: 'module'
      }
    },
    plugins: {
      perfectionist,
      'style': stylistic,
      'unused-imports': unusedImports
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': ['error', {
        disallowTypeAnnotations: false,
        fixStyle: 'separate-type-imports',
        prefer: 'type-imports'
      }],
      '@typescript-eslint/no-unused-vars': ['error', {
        args: 'after-used',
        argsIgnorePattern: '^_',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        ignoreRestSiblings: true,
        varsIgnorePattern: '^_'
      }],
      'perfectionist/sort-imports': ['error', {
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling', 'index']
        ],
        internalPattern: [
          '^@deja-vue/.+',
          '^deja-vue$'
        ]
      }],
      'perfectionist/sort-named-imports': 'error',
      'perfectionist/sort-objects': ['error', {
        groups: ['property', 'method'],
        order: 'asc',
        type: 'alphabetical'
      }],
      'style/arrow-parens': ['error', 'as-needed'],
      'style/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'style/comma-dangle': ['error', 'never'],
      'style/member-delimiter-style': ['error', {
        multiline: {
          delimiter: 'none',
          requireLast: false
        },
        multilineDetection: 'brackets',
        singleline: {
          delimiter: 'comma',
          requireLast: false
        }
      }],
      'style/object-curly-spacing': ['error', 'always'],
      'style/quote-props': ['error', 'consistent-as-needed'],
      'style/quotes': ['error', 'single', {
        allowTemplateLiterals: 'never',
        avoidEscape: true
      }],
      'style/semi': ['error', 'never'],
      'style/space-before-function-paren': ['error', 'always'],
      'style/space-in-parens': ['error', 'never'],
      'unused-imports/no-unused-imports': 'error',
      'vue/attributes-order': ['error', {
        alphabetical: true,
        order: [
          'DEFINITION',
          'CONDITIONALS',
          'LIST_RENDERING',
          'RENDER_MODIFIERS',
          ['UNIQUE', 'GLOBAL'],
          'TWO_WAY_BINDING',
          'OTHER_DIRECTIVES',
          'ATTR_SHORTHAND_BOOL',
          'ATTR_STATIC',
          'ATTR_DYNAMIC',
          'EVENTS',
          'CONTENT',
          'SLOT'
        ]
      }],
      'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],
      'vue/comma-dangle': ['error', 'never'],
      'vue/max-attributes-per-line': ['error', {
        multiline: { max: 1 },
        singleline: { max: 3 }
      }],
      'vue/multi-word-component-names': 'off'
    }
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        extraFileExtensions: ['.vue'],
        parser: tseslint.parser,
        sourceType: 'module'
      }
    }
  }
]
