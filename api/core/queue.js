/**
 * QUEUE
 * Funny test with ES6 :-)
 */

module.exports = $ => {

    /**
     * PRIVATE
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
            this.options = { ...{
                delay: 25
            }, ...options};
            this.stats = {
                success: [],
                error: []
            };

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
         * @param fnc
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

                if (this.stats.error.length) {

                    console.log(
                        $.color.fgGray,
                        "     ┬",
                        $.color.reset
                    );

                    this.stats.error.map((error, index) => {

                        let isEnd = (index === this.stats.error.length -1);
                        let tree = isEnd ? "└─" : "├─";
                        let last = isEnd ? " " : "|";

                        console.log(
                            $.color.fgGray,
                            "     " + tree,
                            $.color.bgBrightRed + $.color.fgBrightWhite,
                            (index+1) + "",
                            $.color.reset,
                            $.color.reset,
                            error.name,
                            $.color.fgGray,
                            "\n     ", last + "     ",
                            $.color.reset + $.color.fgBrightRed,
                            error.response,
                            $.color.fgGray,
                            "\n     ", last + "     ",
                            $.color.reset
                        );
                    })
                }

                else {
                    console.log(
                        $.color.fgGray,
                        "     ┬",
                        "\n      └─",
                        $.color.bgBrightGreen + $.color.fgBrightWhite,
                        this.stats.success.length + "",
                        $.color.reset
                    );
                }

                if (typeof fnc === "function") {
                    fnc(this.stats);
                }

                $.fire("betiny:test:end", {
                    options: this.options,
                    total: this.total,
                    error: this.stats.error
                });

            }

            else {

                // TEST.
                if (current.test) {

                    current.success = await current.test();

                    if (current.success === true) {
                        this.stats.success.push(current.success);
                    }
                    else {
                        this.stats.error.push({
                            name: current.name,
                            response: current.success
                        });
                    }

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

    $.queue = (...args) => {
        return new Queue(...args);
    };

};
