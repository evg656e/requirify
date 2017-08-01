import QtQuick 2.9
import QtTest 1.1
import "./tst_nodemodules.qml.js" as Test

TestCase {
    id: test
    name: 'TestNodeModules'

    function test_os() {
        Test.test_os(test);
    }

    function test_widget() {
        Test.test_widget(test);
    }

    function test_addPath() {
        Test.test_addPath(test);
    }
}
