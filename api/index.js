/**
 * MAIN WRAPPER
 * TODO: CHECK NODE VERSION => process.version
 */

let betiny = {};

require("./core/env.js")(betiny);
require("./core/events.js")(betiny);
require("./core/log.js")(betiny);
require("./core/utils.js")(betiny);
require("./core/queue.js")(betiny);
require("./core/files.js")(betiny);
require("./core/request.js")(betiny);

require("./core/mysql.js")(betiny);
require("./core/server.js")(betiny);
require("./core/arguments.js")(betiny);

require("./core/middleware.js")(betiny);
require("./core/session.js")(betiny);
require("./core/routes.js")(betiny);

betiny.fire("betiny:preload");

// Prevent error message from fetch under NODE.JS 18+
process.removeAllListeners('warning');

module.exports = betiny;
