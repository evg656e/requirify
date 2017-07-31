const assert = chai.assert;

describe('Test CommonJS', () => {
    [
        { tag: 'absolute' },
        { tag: 'cyclic' },
        { tag: 'determinism' },
        { tag: 'exactExports' },
        { tag: 'hasOwnProperty' },
        { tag: 'method' },
        { tag: 'missing' },
        { tag: 'monkeys' },
        { tag: 'nested' },
        { tag: 'relative' },
        { tag: 'transitive' }
    ].forEach((data) => {
        it(data.tag, () => {
            var threw = true;
            try {
                require(`./${data.tag}/program.js`);
                threw = false;
            }
            finally {
                assert.ok(!threw);
            }
        });
    });
});
