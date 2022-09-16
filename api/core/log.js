/**
 * LOG - Braije Christophe 2022
 * Use to display some information using the console.
 */

const color = require("../utils/color.js");

module.exports = $ => {

     // The old one. Was used to disable quickly any usage of log.
     $.log = console.log;

    // Database references.
    $.color = color;

    /**
     * HAHA 
     * A more elegant way to manage color in console with icon etc.
     */
    class Log {

        constructor () {
            this.txt = '';
            return this;
        }

        cap (str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }

        text (data) {
            this.txt += data;
            return this;
        }

        background (color) {
            let col = $.color["bg" + this.cap(color)];
            if (col) {
                this.txt += col;
            }
            return this;
        }

        color (color) {
            let col = $.color["fg" + this.cap(color)];
            if (col) {
                this.txt += col;
            }
            return this;
        }

        icon (icon) {
            let ico = $.color[icon];
            if (ico) {
                this.txt += ico;
            }
            return this;
        }

        space (nbr) {
            this.txt += Array(nbr).join(' ');
            return this;
        }

        reset () {
            this.txt += $.color.reset;
            return this;
        }

        finish () {
            return this.txt + $.color.reset;
        }

        underline () {
            this.txt += $.color.underline;
            return this;
        }

        strikethrough () {
            this.txt += $.color.strikethrough;
            return this;
        }

        italic () {
            this.txt += $.color.italic;
            return this;
        }

    }

    $.draw = () => {
        return new Log();
    };
    
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

};
