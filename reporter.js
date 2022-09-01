/**
 * EVENT_RUN_BEGIN
 * EVENT_RUN_END        end    (n/a)    All Suites, Tests and Hooks have completed execution.
 * EVENT_DELAY_BEGIN    waiting    (n/a)    Waiting for global.run() to be called; only emitted when delay option is true.
 * EVENT_DELAY_END      ready    (n/a)    User called global.run() and the root suite is ready to execute.
 * EVENT_SUITE_BEGIN    suite    Suite    The Hooks and Tests within a Suite will be executed, including any nested Suites.
 * EVENT_SUITE_END      suite end    Suite    The Hooks, Tests, and nested Suites within a Suite have completed execution.
 * EVENT_HOOK_BEGIN     hook    Hook    A Hook will be executed.
 * EVENT_HOOK_END       hook end    Hook    A Hook has completed execution.
 * EVENT_TEST_BEGIN     test    Test    A Test will be executed.
 * EVENT_TEST_END       test end    Test    A Test has completed execution.
 * EVENT_TEST_FAIL      fail    Test, Error    A Test has failed or thrown an exception.
 * EVENT_TEST_PASS      pass    Test    A Test has passed.
 * EVENT_TEST_PENDING   pending    Test    A Test was skipped.
 * EVENT_TEST_RETRY     retry    Test, Error    A Test failed, but is about to be retried; only emitted if the retry option is nonzero.
 */

const styleCodes = {

    // Reset all styles.
    reset: [0, 0],

    // Text styles.
    bold: [1, 22],
    dim: [2, 22],
    italic: [3, 23],
    underline: [4, 24],
    inverse: [7, 27],
    hidden: [8, 28],
    strikethrough: [9, 29],

    // Foregound classic colours.
    fgBlack: [30, 39],
    fgRed: [31, 39],
    fgGreen: [32, 39],
    fgYellow: [33, 39],
    fgBlue: [34, 39],
    fgMagenta: [35, 39],
    fgCyan: [36, 39],
    fgWhite: [37, 39],
    fgGray: [90, 39],

    // Foreground bright colours.
    fgBrightRed: [91, 39],
    fgBrightGreen: [92, 39],
    fgBrightYellow: [93, 39],
    fgBrightBlue: [94, 39],
    fgBrightMagenta: [95, 39],
    fgBrightCyan: [96, 39],
    fgBrightWhite: [97, 39],

    // Background basic colours.
    bgBlack: [40, 49],
    bgRed: [41, 49],
    bgGreen: [42, 49],
    bgYellow: [43, 49],
    bgBlue: [44, 49],
    bgMagenta: [45, 49],
    bgCyan: [46, 49],
    bgWhite: [47, 49],
    bgGray: [100, 49],
    bgGrey: [100, 49],

    // Background bright colours.
    bgBrightRed: [101, 49],
    bgBrightGreen: [102, 49],
    bgBrightYellow: [103, 49],
    bgBrightBlue: [104, 49],
    bgBrightMagenta: [105, 49],
    bgBrightCyan: [106, 49],
    bgBrightWhite: [107, 49]

};

const styles = {};

Object.keys(styleCodes).map(styleCode => {
    styles[styleCode] = {
        open: `\x1B[${styleCodes[styleCode][0]}m`,
        close: `\x1B[${styleCodes[styleCode][1]}m`,
    };
});

const color = {

    reset: styles.reset.close,

    // Text styles.
    bold: styles.bold.open,
    dim: styles.dim.open,
    italic: styles.italic.open,
    underline: styles.underline.open,
    inverse: styles.inverse.open,
    hidden: styles.hidden.open,
    strikethrough: styles.strikethrough.open,

    // Foregound classic colours.
    fgBlack: styles.fgBlack.open,
    fgRed: styles.fgRed.open,
    fgGreen: styles.fgGreen.open,
    fgYellow: styles.fgYellow.open,
    fgBlue: styles.fgBlue.open,
    fgMagenta: styles.fgMagenta.open,
    fgCyan: styles.fgCyan.open,
    fgWhite: styles.fgWhite.open,
    fgGray: styles.fgGray.open,

    // Foreground bright colours.
    fgBrightRed: styles.fgBrightRed.open,
    fgBrightGreen: styles.fgBrightGreen.open,
    fgBrightYellow: styles.fgBrightYellow.open,
    fgBrightBlue: styles.fgBrightBlue.open,
    fgBrightMagenta: styles.fgBrightMagenta.open,
    fgBrightCyan: styles.fgBrightCyan.open,
    fgBrightWhite: styles.fgBrightWhite.open,

    // Background basic colours.
    bgBlack: styles.bgBlack.open + styles.fgBrightWhite.open,
    bgRed: styles.bgRed.open + styles.fgWhite.open,
    bgGreen: styles.bgGreen.open + styles.fgWhite.open,
    bgYellow: styles.bgYellow.open + styles.fgWhite.open,
    bgBlue: styles.bgBlue.open + styles.fgWhite.open,
    bgMagenta: styles.bgMagenta.open + styles.fgWhite.open,
    bgCyan: styles.bgCyan.open + styles.fgWhite.open,
    bgWhite: styles.bgWhite.open + styles.fgBlack.open,
    bgGray: styles.bgGray.open + styles.fgWhite.open,
    bgGrey: styles.bgGrey.open + styles.fgWhite.open,

    // Background bright colours.
    bgBrightRed: styles.bgBrightRed.open + styles.fgBrightWhite.open,
    bgBrightGreen: styles.bgBrightGreen.open + styles.fgBrightWhite.open,
    bgBrightYellow: styles.bgBrightYellow.open + styles.fgBrightWhite.open,
    bgBrightBlue: styles.bgBrightBlue.open + styles.fgBrightWhite.open,
    bgBrightMagenta: styles.bgBrightMagenta.open + styles.fgBrightWhite.open,
    bgBrightCyan: styles.bgBrightCyan.open + styles.fgBrightWhite.open,
    bgBrightWhite: styles.bgBrightWhite.open + styles.fgBlack.open

};


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
                    console.log(this.spaces(), color.fgBrightBlue, suite.title, color.reset);
                    console.log(this.spaces(3), color.fgGray, "┬", color.reset);

                    this.section++;

                }
                else if (this._indents > 1) {
                    console.log(this.spaces(3), color.fgGray, "|", color.reset);
                    console.log(this.spaces(3), color.fgGray, "├─", color.fgYellow, suite.title, color.reset);
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
