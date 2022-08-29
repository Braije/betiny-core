/**
 * TEST ENGINE
 */

const fs = require("fs");

module.exports = $ => {


    $.test = {

        add: (name, config) => {

        }

    };

    /**
     * TESTS
     */

    $.arguments.add("betiny:test:file", () => {

        try {

            $.log.back();
            $.log.child("Collect test");

            let list = fs.readdirSync("api/core");

            let tests = list.filter(file => {
               return file.endsWith(".test.js");
            });

            console.log(tests);

        }
        catch (e) {
            $.log.end("\33[31mThis command is only available in core mode.");
            process.exit();
        }

        process.exit();

        return;

        let create =  $.file.create("./toto/tutu.js", "what");
        $.log.child("create", "./toto/tutu.js", create);

        $.log.pipe();

        let exist1 =  $.file.exist("./toto/tutu.js");
        $.log.child("exist", "./toto/tutu.js", exist1);

        let exist2 =  $.file.exist("./toto");
        $.log.child("exist", "./toto", exist2);

        let exist3 =  $.file.exist("./unexisting");
        $.log.child("exist", "./unexisting", exist3);

        let exist4 =  $.file.exist("/toto");
        $.log.child("exist", "/toto", exist4);

        let read1 = $.file.read("./tata");
        $.log.child("read", "./tata", read1);

        let read2 = $.file.read("./toto");
        $.log.child("read", "./toto", read2);

        $.log.pipe();
        $.log.end("STOP");

        process.exit();

    });

};
