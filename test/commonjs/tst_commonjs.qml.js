Qt.include('../../dist/require.js');

function test_commonJS(test, data) {
    var threw = true;
    try {
        require('./' + data.tag + '/program.js');
        threw = false;
    }
    finally {
        test.verify(!threw);
    }
}
