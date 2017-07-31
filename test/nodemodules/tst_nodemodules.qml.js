Qt.include('../../dist/require.js');
var os = require('os');
var Widget = require('./lib/widget.js');

function test_os(test) {
    test.verify(typeof os !== 'undefined');
    test.compare(os.platform(), 'browser');
}

function test_widget(test) {
    test.verify(typeof Widget !== 'undefined');
    var widget = new Widget();
    test.verify(typeof widget.on !== 'undefined');
    widget.on('visibilityChanged', function(target, visibility) {
        test.compare(target, widget);
        test.compare(visibility, true);
    });
    widget.show();
    widget.on('clicked', function(target, x, y) {
        test.compare(target, widget);
        test.compare(x, 100);
        test.compare(y, 100);
    });
    widget.click(100, 100);
}
