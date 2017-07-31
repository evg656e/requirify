import QtQuick 2.9
import QtTest 1.1
import "./tst_babel.qml.js" as Test

TestCase {
    id: test
    name: 'TestBabel'

    function test_transform() {
        Test.test_transform(test);
    }

    function test_person() {
        Test.test_person(test);
    }
}
