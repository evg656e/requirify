const gulp = require('gulp');
const fs = require('fs');
const path = require('path');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const through = require('through2');

const browserifyBuiltins = require('browserify/lib/builtins.js');
const browserifyBuiltinsStr = fs.readFileSync(require.resolve('browserify/lib/builtins.js'), 'utf8');

const browserifiedIds = {};
const re = /exports\.([\w\d]+)\s*=\s*require\.resolve\('([^']+)'\)/g;
let match;
while ((match = re.exec(browserifyBuiltinsStr))) {
    let id = match[1];
    let browserifiedId = match[2];
    if (id.startsWith('_') || browserifiedId.endsWith('_empty.js'))
        continue;
    if (browserifiedId.endsWith('/'))
        browserifiedId = browserifiedId.substr(0, browserifiedId.length - 1);
    browserifiedIds[id] = browserifiedId;
}
delete browserifiedIds['buffer'];
delete browserifiedIds['path'];

let bootstrapPrelude = fs.readFileSync('./bootstrap.js', 'utf8');
bootstrapPrelude = bootstrapPrelude.replace(
    'requireBuiltin.browserifiedIds = {};',
    'requireBuiltin.browserifiedIds = ' + JSON.stringify(browserifiedIds) + ';');

const entries = [
    ['./lib/require.js', { expose: 'require' }],
    [require.resolve('ieee754'), { expose: 'ieee754' }],
    [require.resolve('base64-js'), { expose: 'base64-js' }],
    [browserifyBuiltins._process, { expose: 'process' }],
    [browserifyBuiltins.buffer, { expose: 'buffer' }],
    [browserifyBuiltins.path, { expose: 'path' }]
];

//! \see https://www.npmjs.com/package/browserify-handbook#compiler-pipeline
//! \see https://github.com/gulpjs/gulp/tree/master/docs/recipes
//! \see https://www.viget.com/articles/gulp-browserify-starter-faq
gulp.task('build', function () {
    const b = browserify({
        detectGlobals: false,
        prelude: bootstrapPrelude
    });

    entries.forEach((entry) => {
        b.add.apply(b, entry);
    });

    return b.bundle()
        .pipe(source('require.js'))
        .pipe(gulp.dest('./dist/'));
});
