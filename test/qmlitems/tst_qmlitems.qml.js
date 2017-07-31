Qt.include('../../dist/require.js');
var Wrapper = require('./wrapper.js');

function test_itemWrapper(test, textEdit) {
    test.verify(typeof Wrapper !== 'undefined');
    var wrapper = new Wrapper(textEdit);
    test.compare(wrapper.textEdit.text, '');
    test.compare(wrapper.getText(),'');
    wrapper.setText('cool');
    test.compare(wrapper.textEdit.text, 'cool');
    test.compare(wrapper.getText(), 'cool');
}
