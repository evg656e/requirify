/*!
    \class Signal
    \brief Implementation of signal/slot pattern.
    \see https://github.com/millermedeiros/js-signals/wiki/Comparison-between-different-Observer-Pattern-implementations
    \see http://robdodson.me/javascript-design-patterns-observer/
*/
export class Signal {
    constructor() {
        this.slots = null;
    }

    emit() {
        if (!this.slots)
            return false;
        if (typeof this.slots === 'function')
            this.slots.apply(this, arguments);
        else {
            let list = this.slots.slice(); // avoid 'once' side-effects
            for (let i = 0; i < list.length; i++)
                list[i].apply(this, arguments);
        }
        return true;
    }

    connect(slot) {
        if (typeof slot !== 'function')
            throw new TypeError('slot must be a function');
        if (!this.slots)
            this.slots = slot;
        else if (typeof this.slots === 'function')
            this.slots = [this.slots, slot];
        else
            this.slots.push(slot);
    }

    disconnect(slot) {
        if (typeof slot !== 'function')
            throw new TypeError('slot must be a function');
        if (!this.slots)
            return;
        if (typeof this.slots === 'function') {
            if (slot === this.slots)
                this.slots = null;
        }
        else {
            for (let i = this.slots.length; i-- > 0;)
                if (slot === this.slots[i])
                    this.slots.splice(i, 1);
            if (this.slots.length === 1)
                this.slots = this.slots[0];
            else if (this.slots.length === 0)
                this.slots = null;
        }
    }

    once(slot) {
        if (typeof slot !== 'function')
            throw new TypeError('slot must be a function');
        let fired = false;
        function g() {
            if (!fired) {
                fired = true;
                this.disconnect(g);
                slot.apply(this, arguments);
            }
        }
        g.slot = slot;
        this.connect(g);
    }

    disconnectAll() {
        this.slots = null;
    }

    slotCount() {
        if (!this.slots)
            return 0;
        if (typeof this.slots === 'function')
            return 1;
        return this.slots.length;
    }
}

/*!
    \fn signal
*/
export default function signal() {
    //! \see https://stackoverflow.com/questions/340383/can-a-javascript-object-have-a-prototype-chain-but-also-be-a-function
    function signal() {
        return Signal.prototype.emit.apply(signal, arguments);
    }
    Object.setPrototypeOf(signal, Signal.prototype);
    return signal;
}
