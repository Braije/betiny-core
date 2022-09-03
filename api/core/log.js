/**
 * LOG
 * Use to display some information using the console.
 *
 * TODO: chainable?
 *  - $.log("message","red").icon("sun", "blue")
 *  - $.log().icon("sun","yellow").message("msg", "white").message("2").run();
 */

const color = require("../utils/color.js");

module.exports = $ => {

    $.color = color;

    /**
     * PUBLIC
     */

    $.log = console.log;

    /**
     * EVENTS CATCHER
     * Restore color in the console on process error.
     */

    $.on("betiny:server:error", () => {

        // Color.
        $.log($.color.reset);

        // Cursor visible.
        process.stderr.write('\x1B[?25h');

    });

}
