import QtQuick 2.9
import QtTest 1.1
import "./tst_simple.qml.js" as Test

TestCase {
    id: test
    name: 'TestSimple'

    function test_path() {
        Test.test_path(test);
    }

    function test_person() {
        Test.test_person(test);
    }
}
