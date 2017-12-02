/* eslint global-require: 'off' */
const test = require('tape-async');
const path = require('path');

test.createStream().pipe(process.stdout);

process.argv.slice(2).forEach((file) => {
    require(path.resolve(file));
});
