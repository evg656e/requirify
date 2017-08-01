Qt.include('../../dist/require.js');

function test_os(test) {
    var os = require('os');
    test.verify(typeof os !== 'undefined');
    test.compare(os.platform(), 'browser');
}

function test_widget(test) {
    var Widget = require('./lib/widget.js');
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

function test_addPath(test) {
    var clone = require('clone');
    test.verify(typeof clone === 'undefined');
    require.addPath('../..');
    clone = require('clone');
    test.verify(typeof clone !== 'undefined');
}
