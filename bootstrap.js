(function bootstrap(builtins) {
    function requireBuiltin(id) {
        if (!builtins.hasOwnProperty(id))
            return;
        if (requireBuiltin.cache.hasOwnProperty(id))
            return requireBuiltin.cache[id].exports;
        if (builtins.hasOwnProperty(id)) {
            var module = { exports: {} };
            requireBuiltin.cache[id] = module;
            builtins[id][0].call(module.exports, requireBuiltin, module, module.exports);
            return module.exports;
        }
    }

    requireBuiltin.cache = {};
    requireBuiltin.browserifiedIds = {};

    (function(global, require) {
        global.global = global;
        global.require = require;
        global.process = require('process');
        global.Buffer = require('buffer').Buffer;
    }(typeof self !== 'undefined' ? self : Function('return this')(), requireBuiltin('require').require));
})
