# requirify

Node-style require for browser-like and QML JavaScript environments.

## Why?

Super fast (in terms of setup) prototyping. No need to build assets, no need to rebuild QML apps. When ready, fallback to Webpack (or whatever tool) builds.

## Install

npm install @evg656e/requirify --save-dev

## Usage

You can find some code examples in <https://github.com/evg656e/broadcast-example> and this project test folder.

### Browsers with local files

Enable local file support:
  * Chrome: run `chrome --allow-file-access-from-files`
  * Firefox: go to `about:config`, set `security.fileuri.strict_origin_policy` to `false` (you will probably want to create seperate profile for this)

Add link to requirify to HTML page: `<script src="./node_modules/@evg656e/requirify/dist/require.js"></script>` (change paths to appropriate for you project structure)
Now you can access Node-like modules within your page:
```js
var Button = require('./lib/button');

var btn = new Button('Go!');
btn.on('clicked', function(target) {
    console.log('Button clicked:', target.text);
});
btn.click();
```

Where `lib/button.js` is:
```js
var Widget = require('./widget');

function Button(text, parent) {
    Widget.call(this, parent);
    this.text = text;
}

Button.prototype = Object.create(Widget.prototype);
Button.prototype.constructor = Button;

Button.prototype.click = function() {
    this.emit('clicked', this);
};

module.exports = Button;
```

And `lib/widget.js` is:
```js
var EventEmitter = require('events'); // https://www.npmjs.com/package/events 

function Widget(parent) {
    EventEmitter.call(this);
    this.parent = parent;
    this.visible = false;
}

Widget.prototype = Object.create(EventEmitter.prototype);
Widget.prototype.constructor = Widget;

Widget.prototype.show = function() {
    if (!this.visible) {
        this.visible = !this.visible;
        this.emit('visibilityChanged', this);
    }
};

module.exports = Widget;
```

### QML with qmlscene

Install [Qt](https://www.qt.io/download-open-source/).

Open Qt Creator, choose `New Project` -> `Qt Quick UI Prototype`.

In `Projects` tree `Add New...` -> `Qt` -> `JS File`:
```js
Qt.include('./node_modules/@evg656e/requirify/dist/require.js'); // change paths to appropriate for you project structure

var Button = require('./lib/button');
```

In QML file:
```qml
import QtQuick 2.8
import QtQuick.Window 2.2
import './lib.js' as Lib // <-- import JS resource, see http://doc.qt.io/qt-5/qtqml-javascript-imports.html

Window {
    id: window
    // ...
    Component.onCompleted: {
        var btn = new Lib.Button('Go!');
        btn.on('clicked', function(target) {
            console.log('Button clicked:', target.text);
        });
        btn.click();
        // you can access to QML items from JS, e.g.:
        var btn2 = new Lib.Button('Click me', window); // <-- you can use QML Window properties and methods within JS code
    }
}
```

### Node server

To make work `require` with server-side generated HTML pages, handle `request-path` header in your HTTP server:
```js
const http = require('http');
const url = require('url');
const fs = require('fs');

http.createServer(function(req, res) {
    // add this block (don't use this in production!)
    const requestPath = req.headers['request-path'];
    if (requestPath) {
        res.writeHead(200);
        fs.createReadStream(requestPath).on('error', () => {
            res.writeHead(404)
            res.end()
        }).pipe(res);
    }
    // ...
}).listen(8080);
```

Now JS-files will be send from HTTP server (including modules from `node_modules` like `events`). See <https://github.com/evg656e/broadcast-example> for details.

### ES6 and Babel

You can prototype with ES6 modules, using [babel-standalone](https://www.npmjs.com/package/babel-standalone) for Browsers and QML, and (babel-register)[https://www.npmjs.com/package/babel-register] for Node.js.

To enable ES6 in HTML JS:
```js
var Babel = require('./node_modules/babel-standalone');
require.transform = function(content) {
    return Babel.transform(content, { presets: ['es2015'] }).code;
};
var Foo = require('./lib/foo').default; // <- foo contains ES6 code and uses ES6 modules (import/export)
```

To enable ES6 in QML JS:
```js
Qt.include('./node_modules/@evg656e/requirify/dist/require.js');
var Babel = require('./node_modules/@evg656e/requirify/dist/babel.qml'); // <- use patched version of babel-standalone from requirify, standard version won't work because of QML JS engine bugs
require.transform = function(content) {
   return Babel.transform(content, { presets: ['es2015'] }).code;
};
var Foo = require('./lib/foo').default;
```

To enable ES6 in Node:
```js
require('babel-register');
const Foo = require('./lib/foo').default;
```
See <https://babeljs.io/docs/usage/babel-register/> for details.
