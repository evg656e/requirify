(function(root, factory) {
    if (typeof module === 'object' && typeof exports === 'object') {
        factory(exports, require, require('path'));
    }
    else {
        factory(root);
    }
}(this, function(exports, requireBuiltin, path) {

//! \see https://stackoverflow.com/questions/6971583/node-style-require-for-in-browser-javascript
//! \see https://github.com/substack/browserify-handbook#how-node_modules-works
//! \see https://nodejs.org/api/modules.html#modules_all_together

var isFirefox = typeof navigator !== 'undefined' ?
    navigator.userAgent.toLowerCase().indexOf('firefox') !== -1 : false; //! \see https://stackoverflow.com/a/14172194/2895579

function openFile(fileUrl) {
    // console.log('Opening file:', fileUrl);
    try {
        var request = new XMLHttpRequest();
        if (isFirefox)
            request.overrideMimeType('text/plain'); //! \see https://bugzilla.mozilla.org/show_bug.cgi?id=311724#c19
        request.open('GET', fileUrl, false);
        request.setRequestHeader('Require-Path', fileUrl);
        request.send();
        return request.responseText;
    }
    catch (e) {
        // console.log('Error open file:', fileUrl);
    }
}

function loadFile(filename) {
    filename = path.normalize(filename);
    var dirname = path.dirname(filename);
    // console.log('loadFile()', filename, dirname);

    if (require.cache.hasOwnProperty(filename))
        return require.cache[filename].exports;

    var content = openFile(filename);
    if (!content)
        return;

    var module = { exports: {} };
    require.cache[filename] = module;

    var threw = true;
    try {
        var extname = path.extname(filename);
        var transform = require.extensions[extname];
        if (transform) {
            if (typeof Qt === 'object') {
                // we should use eval in qml because qml objects won't work with Function code execution (check test/qmlitems)
                eval(
                    '(function(exports, require, module, __filename, __dirname) {\n' +
                    transform(content, filename) +
                    '\n}.call(module.exports, module.exports, require.bind({ parentdir: dirname }), module, filename, dirname))'
                );
            }
            else {
                // if (!content.endsWith('\n'))
                //     content += '\n'; // qml js engine will throw an error in case of // comment at the end of file without newline
                Function(
                    'exports', 'require', 'module', '__filename', '__dirname', transform(content, filename)
                ).call(
                    module.exports, module.exports, require.bind({ parentdir: dirname }), module, filename, dirname
                );
            }
        }
        else if (extname === '.json') {
            module.exports = JSON.parse(content);
        }
        else {
            delete require.cache[filename];
            return;
        }
        threw = false;
    }
    finally {
        if (threw)
            delete require.cache[filename];
    }
    return module.exports;
}

function loadAsFile(filename) {
    // console.log('loadAsFile()', filename);
    var ret = loadFile(filename);
    if (ret)
        return ret;
    for (var extname in require.extensions) {
        ret = loadFile(filename + extname);
        if (ret)
            return ret;
    }
}

function loadIndex(dirname) {
    // console.log('loadIndex()', dirname);
    return loadFile(path.join(dirname, 'index.js'))
        || loadFile(path.join(dirname, 'index.json'));
}

function loadAsDirectory(dirname) {
    // console.log('loadAsDirectory()', dirname);
    var pckg = loadFile(path.join(dirname, 'package.json')); // using package as variable name will cause qml error (qt bug?)
    if (pckg && pckg.main) {
        var filename = path.join(dirname, pckg.main);
        return loadAsFile(filename)
            || loadIndex(filename);
    }
    return loadIndex(dirname);
}

var node_modules = 'node_modules';

function nodeModulePaths(start) {
    if (!start)
        return [path.join('.', node_modules)].concat(require.paths);
    var parts = start.split(path.sep);
    var dirs = [];
    for (var i = parts.length - 1; i >= 0; i--) {
        if (parts[i] === node_modules)
            continue;
        var dir = path.join.apply(null, parts.slice(0, i).concat(node_modules));
        if (dir === node_modules) { // special case
            dir = path.join('.', node_modules);
            if (dirs.length === 0
                || dirs[dirs.length - 1] !== dir)
                dirs.push(dir);
            continue;
        }
        dirs.push(dir);
    }
    return dirs.concat(require.paths);
}

function loadAsNodeModule(id, start) {
    var dirs = nodeModulePaths(start);
    // console.log('loadAsNodeModule()', id, start, dirs);
    for (var i = 0; i < dirs.length; i++) {
        var filename = path.join(dirs[i], id);
        var ret = loadAsFile(filename)
               || loadAsDirectory(filename);
        if (ret)
            return ret;
    }
}

function require(id) {
    // console.log('require()', id);
    id = requireBuiltin.browserifiedIds.hasOwnProperty(id) ?
         requireBuiltin.browserifiedIds[id] : id;

    var builtin = requireBuiltin(id);
    if (builtin)
        return builtin;

    var isAbsolute = id.startsWith('/');
    var start;
    if (this != null && this.parentdir)
        start = this.parentdir;
    if (isAbsolute
        || id.startsWith('./')
        || id.startsWith('../')) {

        if (!isAbsolute && start)
            id = path.join(start, id);

        return loadAsFile(id)
            || loadAsDirectory(id);
    }
    return loadAsNodeModule(id, start);
}

require.cache = {};

require.paths = [];

//! \see https://github.com/patrick-steele-idem/app-module-path-node
require.addPath = function(dir) {
    if (!dir.endsWith(node_modules))
        dir = path.join(dir, node_modules);
    require.paths.push(dir);
};

require.extensions = {
    '.js': function(content) {
        return content;
    }
};

exports.require = require;

}));
