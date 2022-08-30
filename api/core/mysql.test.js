/**
 * TEST FILE SYSTEM
 */

module.exports = $ => {

    $.test("My custom mysql test app")

    .describe("section 1")
    .task("test 21", () => { return true; })
    .task("test 22", () => { return false; })

    .run();

};