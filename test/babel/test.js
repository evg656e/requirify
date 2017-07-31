var Babel = require('../../node_modules/babel-standalone');
require.transform = function(content) {
    return Babel.transform(content, { presets: ['es2015'] }).code;
};
var Person = require('./lib/person').default;

const assert = chai.assert;

describe('Test Babel', () => {
    it('transform', () => {
        assert.ok(typeof Babel !== 'undefined' && typeof Babel.transform === 'function');
        var input = 'const getMessage = () => "Hello World";';
        var output = Babel.transform(input, { presets: ['es2015'] }).code;
        assert.ok(typeof output === 'string' && output.length !== 0);
    });

    it('person', () => {
        assert.ok(typeof Person !== 'undefined');
        var person = new Person('John Smith');
        assert.strictEqual(person.name, 'John Smith');
        person.nameChanged.connect(function(newName, oldName) {
            assert.strictEqual(oldName, 'John Smith');
            assert.strictEqual(newName, 'Bill Gates');
        });
        person.setName('Bill Gates');
        assert.strictEqual(person.name, 'Bill Gates');
    });
});
