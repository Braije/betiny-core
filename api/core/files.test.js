
const $ = require("../index.js");
const assert = require('assert');

describe('File system', () => {

    describe('file.exist', () => {

        it('./unexisting', () => {
            let test = $.file.exist('./unexisting');
            assert.equal(test, false);
        });

        it('../../hack', () => {
            let test = $.file.exist("../../hack");
            assert.equal(test, false);
        });

        it('./../exist', () => {
            let test = $.file.exist("./../exist");
            assert.equal(test, false);
        });

        it('./exist', () => {
            let test = $.file.exist("./exist");
            assert.equal(test, true);
        });

        it('/exist', () => {
            let test = $.file.exist("/exist");
            assert.equal(test, true);
        });

        it('/', () => {
            let test = $.file.exist("/");
            assert.equal(test, true);
        });

        it('Empty string', () => {
            let test = $.file.exist("");
            assert.equal(test, false, "message --- :(");
        });

    });

    describe('file.read', () => {

        it('Heuuuu', () => {
            //assert.equal(false, false);
        });

    });

});
