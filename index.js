
const $ = require("./api");

$.server.start(() => {
    $.fire("ready");
});
