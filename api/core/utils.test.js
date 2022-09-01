
const $ = require("../index.js");
const assert = require('assert');

describe('Utils', () => {

    it('delay', async () => {
        await $.delay(100);
        assert.equal(false, false);
    });

    it('replace', () => {
    });

});
