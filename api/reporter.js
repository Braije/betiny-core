/**
 * BETINY REPORTER
 * A custom Betiny reporter based on mocha events.
 *
 * MOCHA EVENTS LIST
 *
 * EVENT_RUN_BEGIN
 * EVENT_RUN_END        All Suites, Tests and Hooks have completed execution.
 * EVENT_DELAY_BEGIN    Waiting for global.run() to be called; only emitted when delay option is true.
 * EVENT_DELAY_END      User called global.run() and the root suite is ready to execute.
 * EVENT_SUITE_BEGIN    The Hooks and Tests within a Suite will be executed, including any nested Suites.
 * EVENT_SUITE_END      The Hooks, Tests, and nested Suites within a Suite have completed execution.
 * EVENT_HOOK_BEGIN     A Hook will be executed.
 * EVENT_HOOK_END       A Hook has completed execution.
 * EVENT_TEST_BEGIN     A Test will be executed.
 * EVENT_TEST_END       A Test has completed execution.
 * EVENT_TEST_FAIL      A Test has failed or thrown an exception.
 * EVENT_TEST_PASS      A Test has passed.
 * EVENT_TEST_PENDING   A Test was skipped.
 * EVENT_TEST_RETRY     A Test failed, but is about to be retried; only emitted if the retry option is nonzero.
 */

const path = require("path");
const color = require("./core/console.js");

'use strict';

const Mocha = require('mocha');
const {
    EVENT_RUN_BEGIN,
    EVENT_RUN_END,
    EVENT_TEST_FAIL,
    EVENT_TEST_PASS,
    EVENT_SUITE_BEGIN,
    EVENT_SUITE_END
} = Mocha.Runner.constants;

class betinyReporter {

    constructor (runner) {

        this._indents = -1;
        const stats = runner.stats;

        this.section = 1;
        this.subsection = 1;
        this.test = 1;

        runner

            .once(EVENT_RUN_BEGIN, () => {
                console.log("");
                console.log(
                    color.bgBlue + color.fgBrightWhite, "BETINY",
                    color.bgBlack, "START            ",
                    color.reset
                );
                console.log(this.spaces(3), color.fgGray, "┬", color.reset);
            })

            .once(EVENT_RUN_END, () => {

                console.log(this.spaces(3), color.fgGray, "|", color.reset);
                console.log(this.spaces(3), color.fgGray, "┴", color.reset);
                console.log(
                    color.bgBlue + color.fgBrightWhite, "BETINY",
                    color.bgBlack, "END              ",
                    color.reset
                );
                console.log("");
                console.log(" Total\t\t", stats.passes + stats.failures);
                console.log(" Success\t", stats.passes);
                console.log(" Error\t\t", stats.failures);
                console.log("");

                process.exit();

            })

            .on(EVENT_SUITE_BEGIN, (suite) => {

                this.increaseIndent();

                if (this._indents === 1) {

                    console.log(this.spaces(3), color.fgGray, "┴", color.reset);
                    console.log(this.spaces(),
                        color.fgBrightBlue,
                        suite.title,
                        color.reset + color.fgGray,
                        path.basename(suite.file),
                        color.reset
                    );
                    console.log(this.spaces(3), color.fgGray, "┬", color.reset);

                    this.section++;

                }
                else if (this._indents > 1) {
                    console.log(this.spaces(3), color.fgGray, "|", color.reset);
                    console.log(this.spaces(3), color.fgGray, "├─", color.fgYellow,
                        suite.title,
                        color.reset + color.fgGray,
                        path.basename(suite.file),
                        color.reset
                    );
                    console.log(this.spaces(3), color.fgGray, "|", color.reset);
                }
            })

            .on(EVENT_SUITE_END, () => {
                this.decreaseIndent();
            })

            .on(EVENT_TEST_PASS, test => {
                console.log(this.spaces(3),
                    color.fgGray,
                    "|\t" + color.bgGreen,
                    " OK ",
                    color.reset + color.fgGray,
                    test.title,
                    color.reset
                );
            })
            /* */

            .on(EVENT_TEST_FAIL, (test, err) => {
                console.log(this.spaces(3),
                    color.fgGray,
                    "|\t" + color.bgBrightRed,
                    " KO ",
                    color.reset,
                    test.title,
                    color.reset
                );
                if (err.message) {
                    console.log(this.spaces(3),
                        color.fgGray,
                        "|\t     ",
                        color.fgBrightRed,
                        err.message
                    );
                }
            });
    }

    spaces (adjust = 0) {
        return Array(adjust).join(' ');
    }

    increaseIndent() {
        this._indents++;
    }

    decreaseIndent() {
        this._indents--;
    }
}

module.exports = betinyReporter;
