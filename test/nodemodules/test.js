var os = require('os');
var Widget = require('./lib/widget');

const assert = chai.assert;

describe('Test Node Modules', () => {
    it('os', () => {
        assert.ok(typeof os !== 'undefined');
        assert.strictEqual(os.platform(), 'browser');
    });

    it('widget', () => {
        assert.ok(typeof Widget !== 'undefined');
        var widget = new Widget();
        assert.ok(typeof widget.on !== 'undefined');
        widget.on('visibilityChanged', function(target, visibility) {
            assert.strictEqual(target, widget);
            assert.strictEqual(visibility, true);
        });
        widget.show();
        widget.on('clicked', function(target, x, y) {
            assert.strictEqual(target, widget);
            assert.strictEqual(x, 100);
            assert.strictEqual(y, 100);
        });
        widget.click(100, 100);
    });
});
