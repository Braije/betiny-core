/**
 * CUSTOM BETINY TESTER
 */

// Use internally to bypass the secure limitation from $.file API
const fs = require("fs");
const path = require("path");

module.exports = $ => {

    /**
     * PUBLIC
     *
     * @param args
     * @returns {Queue}
     */

    $.test = (...args) => {
        return $.queue(...args);
    };

    /**
     * COMMAND
     */

    $.arguments.add("betiny:test", (...args) => {

        // TODO: $.file.dir(), secure, restrict + aliasing.
        const readdirSync = (p, a = []) => {
            if (fs.statSync(p).isDirectory()) {
                fs.readdirSync(p).map(f => readdirSync(a[a.push(path.join(p, f)) - 1], a))
            }
            return a;
        };
        let tutu = readdirSync(__dirname);

        let tata = tutu.filter(str => {
            return str.endsWith(".betiny.js");
        }).map( str => {
            return {
                path: path.resolve(str),
                name: path.basename(str)
            };
        })

        process.stdout.moveCursor(0,-1);
        process.stdout.clearLine();
        process.stdout.cursorTo(0);

        const throttle = async () => {

            let current = tata[0];

            if (current) {

                console.log(
                    $.color.fgGreen,
                    "  ",
                    current.name,
                    $.color.reset + $.color.fgGray
                );

                tata.shift();

                try {
                    await require(current.path)($);
                }
                catch (e) {
                    throttle();
                }

            }
            else {
                // console.log("\nEND", "TODO: STATS? etc..");
                process.exit();
            }

        };

        $.on("betiny:test:end", throttle);

        throttle();

    });

};
