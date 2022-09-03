const $ = require("../index.js");
const assert = require('assert');

describe('Mysql', () => {

    it('Connexion should be success', async () => {

        let test = await $.mysql().query("SELECT 1").then(() => {
            return true;
        }).catch(() => {
            return false;
        });

        assert.equal(test, true);

    });

    it('Connexion should failed', async () => {

        let test = await $.mysql("unexisting").query("SELECT 1").then(() => {
            return true;
        }).catch(() => {
            return false;
        });

        assert.equal(test, false);

    });

});
