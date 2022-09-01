module.exports = $ => {

    $.test("File system")
        .describe("Un truc ...")
            .task("... a testé 1", () => {
                return false;
            })
            .task("... a testé 1", () => {
                return true;
            })
        .describe("Un autre truc ...")
            .task("... a testé 1", () => {
                return true;
            })
            .task("... a testé 1", () => {
                return true;
            })
        .run( stats => {
            console.log("END", stats);
        });
};
