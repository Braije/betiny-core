
const $ = require("../index.js");
const assert = require('assert');

describe('File system', () => {

    describe('file.create - folder', () => {

        it('Should be able to create "toto"', () => {
            let test = $.file.create("toto");
            assert.equal(test, true);
        });

        it('Should be able to create "/toto"', () => {
            let test = $.file.create("/toto");
            assert.equal(test, true);
        });

        it('Should be able to create "./toto"', () => {
            let test = $.file.create("./toto");
            assert.equal(test, true);
        });

        it('Should be able to create "./toto/tutu"', () => {
            let test = $.file.create("./toto/tutu");
            assert.equal(test, true);
        });

        it('Should not be able to create "../../hack"', () => {
            let test = $.file.create("../../hack");
            assert.equal(test, false);
        });

        it('Should not be able to create "./to%@#to"', () => {
            let test = $.file.create("./to%@#to");
            assert.equal(test, false);
        });

        it('Should not be able to create "./toto/to%@#to"', () => {
            let test = $.file.create("./toto/to%@#to");
            assert.equal(test, false);
        });

    });

    describe('file.create - file', () => {

        it('Should be able to create "toto.js"', () => {
            let test = $.file.create("toto.js", "test");
            assert.equal(test, true);
        });

        it('Should be able to create "toto/toto.js"', () => {
            let test = $.file.create("toto/toto.js", "test");
            assert.equal(test, true);
        });

        it('Should not be able to create "./to%@#to.js"', () => {
            let test = $.file.create("./to%@#to.js");
            assert.equal(test, false);
        });

        it('Should not be able to create "../../hack.js"', () => {
            let test = $.file.create("../../hack.js");
            assert.equal(test, false);
        });

    });

    describe('file.exist - folder', () => {

        it('Should return false for "unexisting"', () => {
            let test = $.file.exist("unexisting");
            assert.equal(test, false);
        });
        it('Should return false for "./unexisting"', () => {
            let test = $.file.exist('./unexisting');
            assert.equal(test, false);
        });
        it('Should return false for "/unexisting"', () => {
            let test = $.file.exist("/unexisting");
            assert.equal(test, false);
        });

        it('Should return false for "../../hack"', () => {
            let test = $.file.exist("../../hack");
            assert.equal(test, false);
        });

        it('Should return false for "./../exist"', () => {
            let test = $.file.exist("./../exist");
            assert.equal(test, false);
        });

        it('Should return true for "./toto"', () => {
            let test = $.file.exist("./toto");
            assert.equal(test, true);
        });

        it('Should return true for "/toto"', () => {
            let test = $.file.exist("/toto");
            assert.equal(test, true);
        });

        it('Should return true for "/"', () => {
            let test = $.file.exist("/");
            assert.equal(test, true);
        });

        it('Should return false for an empty string', () => {
            let test = $.file.exist("");
            assert.equal(test, false, "message --- :(");
        });

    });

    describe('file.exist - file', () => {

        it('Should return true for "/toto.js"', () => {
            let test = $.file.exist("/toto.js");
            assert.equal(test, true);
        });

        it('Should return true for "toto/toto.js"', () => {
            let test = $.file.exist("toto/toto.js");
            assert.equal(test, true);
        });

        it('Should return false for "unexisting.js"', () => {
            let test = $.file.exist("unexisting.js");
            assert.equal(test, false);
        });

        it('Should return false for "../../hack.js"', () => {
            let test = $.file.exist("../../hack.js");
            assert.equal(test, false);
        });

    });

    describe('file.read - folder', () => {

        it('Should be able to read "/"', () => {
            let test = $.file.read("/");
            assert.equal(test.files.length, 1);
            assert.equal(test.folders.length, 1);
        });

        it('Should be able to read "/toto"', () => {
            let test = $.file.read("/toto");
            assert.equal(test.files.length, 1);
            assert.equal(test.folders.length, 1);
        });

        it('Should be able to read "./"', () => {
            let test = $.file.read("./");
            assert.equal(test.files.length, 1);
            assert.equal(test.folders.length, 1);
        });

        it('Should be able to read "./toto"', () => {
            let test = $.file.read("./toto");
            assert.equal(test.files.length, 1);
            assert.equal(test.folders.length, 1);
        });

        it('Should not be able to read "../../"', () => {
            let test = $.file.read("../../");
            assert.equal(test.files.length, 0);
            assert.equal(test.folders.length, 0);
        });

    });

    describe('file.read - file', () => {

        it('Should be able to read "toto.js"', () => {
            let test = $.file.read("toto.js");
            assert.equal(test, 'test');
        });

        it('Should not be able to read "../toto/toto.js"', () => {
            let test = $.file.read("../toto/toto.js");
            assert.equal(test, false);
        });

        it('Should not be able to read "unexisting.js"', () => {
            let test = $.file.read("unexisting.js");
            assert.equal(test, false);
        });

    });

    describe('file.delete - file', () => {

        it('Should be able to delete "toto.js"', () => {
            let test = $.file.delete("toto.js");
            assert.equal(test, true);
        });

        it('Should be able to delete "toto/toto.js"', () => {
            let test = $.file.delete("toto/toto.js");
            assert.equal(test, true);
        });

        it('Should not be able to delete "../../toto.js"', () => {
            let test = $.file.delete("../../toto.js");
            assert.equal(test, false);
        });

        it('Should not be able to delete "unexisting.js"', () => {
            let test = $.file.delete("unexisting.js");
            assert.equal(test, false);
        });

    });

    describe('file.delete - folder', () => {

        it('Should be able to delete "toto/tutu"', () => {
            let test = $.file.delete("toto/tutu");
            assert.equal(test, true);
        });

        it('Should be able to delete "toto"', () => {
            let test = $.file.delete("toto");
            assert.equal(test, true);
        });

        it('Should not be able to delete "/"', () => {
            let test = $.file.delete("/");
            assert.equal(test, false);
        });

        it('Should not be able to delete "../../"', () => {
            let test = $.file.delete("../../");
            assert.equal(test, false);
        });

    });

});
