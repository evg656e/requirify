var EventEmitter = require('events');

function Widget() {
    EventEmitter.call(this);
    this.visible = false;
}

Widget.prototype = Object.create(EventEmitter.prototype);
Widget.prototype.constructor = Widget;

Widget.prototype.show = function() {
    if (!this.visible) {
        this.visible = !this.visible;
        this.emit('visibilityChanged', this, this.visible);
    }
};

Widget.prototype.hide = function() {
    if (this.visible) {
        this.visible = !this.visible;
        this.emit('visibilityChanged', this, this.visible);
    }
};

Widget.prototype.click = function(x, y) {
    this.emit('clicked', this, x, y);
};

module.exports = Widget;
