/**
 * LOG
 * Use to display some information using the console.
 *
 * TODO: chainable?
 *  - $.log("message","red").icon("sun", "blue")
 *  - $.log().icon("sun","yellow").message("msg", "white").message("2").run();
 */

module.exports = $ => {

    /**
     * PRIVATE
     */

    const log = {

        message: (...args) => {

            let icon = args[0] || "";
            let main = args[1]?.toString() || "";
            let response = args[2] || "";

            console.log(icon, main, "\033[33m", response, "\033[0m", ...args.slice(3));
        },
        back: () => {
            process.stdout.moveCursor(0,-1);
        },
        start: () => {
            console.log("      \33[90m┬\033[0m");
        },
        top: (...args) => {
            log.message("      \033[90m┌─", ...args);
        },
        pipe: (...args) => {
            log.message("      \033[90m|", ...args);
        },
        child: (...args) => {
            log.message("      \033[90m├─", ...args);
        },
        end: (...args) => {
            log.message("      \033[90m└─", ...args, "\n");
        },
        info: (...args) => {
            log.message(" \033[32m✖\033[0m ", ...args);
        },
        success: (...args) => {
            log.message(" \033[32m✔\033[0m ", ...args);
        },
        error: (...args) => {
            log.message(" \033[31m✱\033[0m ", ...args);
        },
        debug: (...args) => {
            log.message(" - ", ...args);
        }

    };

    /**
     * PUBLIC
     */

    $.log = log;

    /**
     * EVENTS CATCHER
     * Restore color in the console on process error.
     */

    $.on("betiny:server:error", () => {

        // Color.
        console.log("\033[0m\n");

        // Cursor visible.
        process.stderr.write('\x1B[?25h');

    });

}
