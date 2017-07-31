Qt.include('../../dist/require.js');

function test_directories(test, data) {
    var lib = require('./' + data.tag);
    test.verify(lib !== undefined);
    test.compare(typeof lib.foo, 'function');
    test.compare(lib.foo(), 'bar');
}
