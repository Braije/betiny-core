/**
 *
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

let colors = {};

Object.keys(styleCodes).map(styleCode => {
    styles[styleCode] = {
        open: `\x1B[${styleCodes[styleCode][0]}m`,
        close: `\x1B[${styleCodes[styleCode][1]}m`,
    };
    colors[styleCode] = styles[styleCode]["open"];
});

/**
 * process.stdout.moveCursor(0,-1);
 * process.stdout.clearLine();
 * process.stdout.cursorTo(0);
 */

let color = { ...colors, ...{
    top: colors.fgGray + "┬" + colors.reset,
    pipe: colors.fgGray + "|" + colors.reset,
    child: colors.fgGray + "├─" + colors.reset,
    end: colors.fgGray + "└─" + colors.reset,
    bottom: colors.fgGray + "┴" + colors.reset,
    plus: colors.fgCyan + " ✖ " + colors.reset,
    check: colors.fgGreen + " ✔ " + colors.reset,
    error: colors.fgRed + " ✱ " + colors.reset
}};

color.space = (nbr) => {
    return Array(nbr).join(' ');
}

module.exports = color;
