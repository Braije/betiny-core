/**
 * TEST ENGINE
 */

// Use internally to bypass the secure limitation from $.file API
const fs = require("fs");
const path = require("path");

module.exports = $ => {

    /**
     * QUEUE
     * Funny test with ES6 :-)
     */

    class Queue {

        /**
         *
         * @param name
         * @param options
         * @returns {Queue}
         */

        constructor (name, options = {}) {

            this.queue = [];
            this.name = name || "";
            this.error = 0;
            this.options = { ...{
                delay: 25
            }, ...options};

            return this;
        }

        /**
         *
         * @param data
         * @returns {Queue}
         */

        set (data) {
            this.queue = data;
            return this;
        }

        /**
         *
         * @param cfg
         * @returns {Queue}
         */

        each (fnc) {
            this.options.each = fnc;
            return this;
        }

        /**
         *
         * @param name
         * @returns {Queue}
         */

        describe (name) {

            this.queue.push({
                name: name
            });

            return this;
        }

        /**
         *
         * @param name
         * @param func
         * @returns {Queue}
         */

        task (name, func) {

            this.queue.push({
                name: name,
                test: func
            });

            return this;
        }

        /**
         *
         * @param fnc
         * @returns {Promise<[]>}
         */

        async check (fnc) {

            let current = this.queue[0];

            if (!current) {

                $.log.end("─────────────────────────────────");

                $.fire("betiny:test:end", {
                    options: this.options,
                    total: this.total,
                    error: this.error
                });

            }

            else {

                // TEST.
                if (current.test) {

                    current.success = await current.test();

                    if (current.success) {
                        $.log.child(current.name);
                    }
                    else {
                        this.error++;
                        $.log.childError(current.name);
                    }

                }

                // QUEUE SECTION.
                else {
                    $.log.section(current.name);
                }

                // EACH.
                if (this.options.each) {
                    await this.options.each(current);
                }

                this.queue.shift();

                setTimeout( () => {
                    this.check(fnc);
                }, this.options.delay);
            }

            return this.queue;
        }

        /**
         *
         * @param fnc
         * @returns {[]}
         */

        run (fnc) {

            $.log.back();

            console.log("");
            $.log.top("─────────────────────────────────");
            $.log.pipe("", this.name);
            $.log.child("─────────────────────────────────");

            // TODO: remove based on "test"
            this.total = this.queue.length;

            this.check(fnc);

            return this.queue;
        }

    }

    /**
     * PUBLIC
     *
     * @param args
     * @returns {Queue}
     */

    $.test = (...args) => {
        return new Queue(...args);
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
            return str.endsWith(".test.js");
        }).map( str => {
            return {
                path: path.resolve(str),
                name: path.basename(str)
            };
        })

        $.log.back();
        console.log("");

        const throttle = async () => {

            let current = tata[0];

            if (current) {

                $.log.test(current.name);
                $.log.end( path.parse(current.path).dir );

                tata.shift();

                try {
                    require(current.path)($);
                }
                catch (e) {
                    throttle();
                }

            }
            else {
                console.log("END", "TODO: STATS? etc..");
                process.exit();
            }

        };

        $.on("betiny:test:end", throttle);

        throttle();

    });

};
