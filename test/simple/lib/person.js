var signal = require('./signal.js').signal;

function Person(name) {
    this.name = name || '';
    this.nameChanged = signal();
}

Person.prototype.setName = function(name) {
    var oldName = this.name;
    this.name = name;
    this.nameChanged(this.name, oldName);
};

module.exports = Person;
