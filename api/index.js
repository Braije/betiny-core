
/**
 * MAIN WRAPPER
 */

let betiny = {};

require("./core/env.js")(betiny);
require("./core/events.js")(betiny);
require("./core/log.js")(betiny);
require("./core/utils.js")(betiny);

require("./core/server.js")(betiny);

require("./core/arguments.js")(betiny);
require("./core/queue.js")(betiny);

require("./core/files.js")(betiny);
require("./core/job.js")(betiny);
// require("./core/http.js")(betiny);

require("./core/mysql.js")(betiny);

require("./core/middleware.js")(betiny);
require("./core/routes.js")(betiny);
require("./core/child.js")(betiny);

if (!betiny.file.exist("./.env")) {
    betiny.log.error("ENV", "Your .env configuration is missing.");
    process.exit();
}

betiny.fire("betiny:preload");

module.exports = betiny;
