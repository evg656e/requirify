/*!
    \fn signal
*/
function Signal() {
    this.slots = null;
}

Signal.prototype.emit = function() {
    if (!this.slots)
        return false;
    if (typeof this.slots === 'function')
        this.slots.apply(null, arguments);
    else {
        var list = this.slots.slice(); // avoid 'once' side-effects
        for (var i = 0; i < list.length; i++)
            list[i].apply(null, arguments);
    }
    return true;
};

Signal.prototype.connect = function(slot) {
    if (typeof slot !== 'function')
        throw new TypeError('slot must be a function');
    if (!this.slots)
        this.slots = slot;
    else if (typeof this.slots === 'function')
        this.slots = [this.slots, slot];
    else
        this.slots.push(slot);
};

Signal.prototype.disconnect = function(slot) {
    if (typeof slot !== 'function')
        throw new TypeError('slot must be a function');
    if (!this.slots)
        return;
    if (typeof this.slots === 'function') {
        if (slot === this.slots)
            this.slots = null;
    }
    else {
        for (var i = this.slots.length; i-- > 0;)
            if (slot === this.slots[i])
                this.slots.splice(i, 1);
        if (this.slots.length === 1)
            this.slots = this.slots[0];
        else if (this.slots.length === 0)
            this.slots = null;
    }
};

function signal() {
    function signal() {
        return Signal.prototype.emit.apply(signal, arguments);
    }
    Object.setPrototypeOf(signal, Signal.prototype);
    return signal;
}

exports.Signal = Signal;
exports.signal = signal;
