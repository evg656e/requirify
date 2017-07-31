Qt.include('../../dist/require.js');
require('../../node_modules/core-js/fn/object/set-prototype-of');
var path = require('path');
var Person = require('./lib/person.js');

function test_path(test) {
    test.verify(typeof path !== 'undefined');
    test.compare(path.normalize('../foo'), '../foo');
    test.compare(path.normalize('./bar/../foo'), 'foo');
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
