/**
 * TEST FILE SYSTEM
 */

module.exports = $ => {

    $.test("My custom file system test app")

    .describe("$.file.create")
        .task("todo", () => { return true; })
        .task("todo", () => { return true; })

    .describe("$.file.exist")
        .task("./toto", async () => {
            await $.delay(250);
            return $.file.exist("./toto");
        })
        .task("./unexisting", async () => {
            return !$.file.exist("./unexisting");
        })

    .describe("$.file.read")
        .task("test 3", () => { return false; })
        .task("test 4", async () => { await $.delay(250);  return true; })

    .run();

};