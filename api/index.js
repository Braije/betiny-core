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

/**
 * Prevent error messages
 * - The Fetch API is an experimental feature.
 * - experimental-loader
 * - Custom ESM Loaders is an experimental feature
 * - The Node.js specifier resolution flag is experimental
 * - Importing JSON modules is an experimental feature
 * 
 * This one remove all :(
 * process.removeAllListeners('warning');
 */

const originalEmit = process.emit; 

process.emit = function (name, data, ...args) {
  if (name === 'warning' 
    && typeof data === 'object' 
    && data.name === 'ExperimentalWarning' 
    && data.message.includes('experimental') 
  ) {
    return false;
  }

  return originalEmit.apply(process, arguments)
}

module.exports = betiny;
