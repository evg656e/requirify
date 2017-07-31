import QtQuick 2.9
import QtTest 1.1
import "./tst_directories.qml.js" as Test

TestCase {
    id: test
    name: 'TestDirectories'

    function test_directories_data() {
        return [
            { tag: 'lib' },
            { tag: 'pack1' },
            { tag: 'pack2' }
        ];
    }

    function test_directories(data) {
        Test.test_directories(test, data);
    }
}
