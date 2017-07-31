var path = require('path');
var Person = require('./lib/person.js');

const assert = chai.assert;

describe('Test Simple', () => {
    it('path', () => {
        assert.ok(typeof path !== 'undefined');
        assert.strictEqual(path.normalize('../foo'), '../foo');
        assert.strictEqual(path.normalize('./bar/../foo'), 'foo');
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
