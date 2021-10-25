module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:vue/essential',
        'plugin:@typescript-eslint/recommended',
    ],
    parser: 'vue-eslint-parser',
    parserOptions: {
        ecmaVersion: 12,
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
    },
    plugins: ['vue', '@typescript-eslint'],
    overrides: [
        {
            plugins: ['component-filenames'],
            files: ['**/*.vue'],
            rules: {
                'component-filenames/upper-camel-case': 2,
            },
        },
    ],
    // 0 -> off
    // 1 -> warn
    // 2 -> error
    rules: {
        'no-mixed-spaces-and-tabs': 2,
        semi: 2,
        'arrow-spacing': [
            'error',
            {
                before: true,
                after: true,
            },
        ],
        'no-empty-function': [
            'error',
            {
                allow: ['arrowFunctions'],
            },
        ],
        '@typescript-eslint/no-empty-function': [
            'error',
            {
                allow: ['arrowFunctions'],
            },
        ],
        '@typescript-eslint/no-unused-vars': 2,
        '@typescript-eslint/no-non-null-assertion': 0,
        '@typescript-eslint/no-explicit-any': 2,
        'no-unref': 0,
        'no-undef': 0,
        '@typescript-eslint/ban-types': [
            'error',
            {
                types: {
                    '{}': {
                        fixWith: 'Record<string,unknown>',
                    },
                },
            },
        ],
        '@typescript-eslint/explicit-module-boundary-types': 0,
        '@typescript-eslint/no-this-alias': [
            'error',
            {
                allowDestructuring: true, // Allow `const { props, state } = this`; false by default
                allowedNames: ['that', 'self'], // Allow `const self = this`; `[]` by default
            },
        ],
        'prefer-rest-params': 0,
        'no-empty-pattern': 0,
        'no-redeclare': 0,
        'no-debugger': 0,
        'object-curly-newline': [
            'error',
            {
                ObjectPattern: {
                    multiline: true,
                },
                ExportDeclaration: {
                    multiline: true,
                    minProperties: 3,
                },
            },
        ],
        'vue/no-unused-vars': [
            'error',
            {
                ignorePattern: '^_',
            },
        ],
    },
};
