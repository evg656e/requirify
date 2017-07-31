Qt.include('../../dist/require.js');
require('../../node_modules/qml-polyfill');
require('../../node_modules/core-js/fn/object/set-prototype-of');
var Babel = require('../../dist/babel.qml');
require.transform = function(content) {
   return Babel.transform(content, { presets: ['es2015'] }).code;
};
var Person = require('./lib/person').default;

function test_transform(test) {
    test.verify(typeof Babel !== 'undefined' && typeof Babel.transform === 'function');
    var input = 'const getMessage = () => "Hello World";';
    var output = Babel.transform(input, { presets: ['es2015'] }).code;
    test.verify(typeof output === 'string' && output.length !== 0);
}

function test_person(test) {
    test.verify(typeof Person !== 'undefined');
    var person = new Person('John Smith');
    test.compare(person.name, 'John Smith');
    person.nameChanged.connect(function(newName, oldName) {
        test.compare(oldName, 'John Smith');
        test.compare(newName, 'Bill Gates');
    });
    person.setName('Bill Gates');
    test.compare(person.name, 'Bill Gates');
}
