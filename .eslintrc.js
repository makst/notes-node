module.exports = {
    'root': true,
    'extends': 'eslint-config-airbnb-base',
    'env': {
        'node': true,
        'es6': true
    },

    'rules': {
        'indent': ['error', 4],
        'import/no-dynamic-require': ['off'],
        'import/prefer-default-export': ['warn']
    },

    'overrides': [
        {
            'files': [ '*.test.js', 'test/tap.js' ],
            'rules': {
                // it's needed to require modules under test in every test
                'global-require': [ 'off' ]
            }
        },
        {
            'files': [ 'src/cli/command/*.js'],
            'excludedFiles': '*.test.js',
            'rules': {
                // cli command outputs info to the user
                'no-console': [ 'off' ]
            }
        }
    ]
}
