import signal from './signal';

export default class Person {
    constructor(name = '') {
        this.name = name;
        this.nameChanged = signal();
    }

    setName(name) {
        let oldName = this.name;
        this.name = name;
        this.nameChanged(this.name, oldName);
    }
}
