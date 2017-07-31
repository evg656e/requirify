exports.print = console.log;

exports.assert = function(guard, message) {
    if (!guard)
        throw new Error('FAIL ' + message);
};
