module.exports = $ => {

    $.test("File system")
        .describe("Un truc ...")
            .task("Un truc a tester qui ne fonctionne pas", () => {
                return true;
            })
            .task("... a testé 1", () => {
                return true;
            })
        .describe("Un autre truc ...")
            .task("A task name description", () => {
                return true;
            })
            .task("... a testé 1", () => {
                return true;
            })
        .run( stats => {
            //console.log("END", stats);
        });
};
