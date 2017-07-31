import QtQuick 2.9
import QtTest 1.1
import "./tst_qmlitems.qml.js" as Test

TextEdit {
    id: textEdit

    TestCase {
        id: test
        name: 'TestQmlItems'

        function test_itemWrapper() {
            Test.test_itemWrapper(test, textEdit);
        }
    }
}
