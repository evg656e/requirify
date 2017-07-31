const assert = chai.assert;

describe('Test Directories', () => {
    [
        { tag: 'lib' },
        { tag: 'pack1' },
        { tag: 'pack2' }
    ].forEach((data) => {
        it(data.tag, () => {
            let lib = require(`./${data.tag}`);
            assert.ok(lib !== undefined);
            assert.strictEqual(typeof lib.foo, 'function');
            assert.strictEqual(lib.foo(), 'bar');
        });
    });
});
