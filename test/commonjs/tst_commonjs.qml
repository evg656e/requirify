import QtQuick 2.9
import QtTest 1.1
import "./tst_commonjs.qml.js" as Test

TestCase {
    id: test
    name: 'TestCommonJS'

    function test_commonJS_data() {
        return [
            { tag: 'absolute' },
            { tag: 'cyclic' },
            { tag: 'determinism' },
            { tag: 'exactExports' },
            { tag: 'hasOwnProperty' },
            { tag: 'method' },
            { tag: 'missing' },
            { tag: 'monkeys' },
            { tag: 'nested' },
            { tag: 'relative' },
            { tag: 'transitive' }
        ];
    }

    function test_commonJS(data) {
        Test.test_commonJS(test, data);
    }
}
