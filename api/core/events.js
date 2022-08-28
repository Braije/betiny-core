
const _events = require('events');

/**
 * EVENTS
 */

module.exports = $ => {

  /**
   * REFERENCES
   */

  let event = new _events.EventEmitter();
  let eventCache = [];

  /**
   * PUBLIC
   */

  $.fire = (name, params) => {
    eventCache.push(name);
    event.emit(name, params);
  };

  $.on = (name, callback) => {
    event.addListener(name, callback);
  };

  $.off = (name, callback) => {
    event.removeListener(name, callback);
  };

  $.once = (name, callback) => {
    event.once(name, callback);
  };

  /**
   * EVENTS CATCHER
   */

  $.on("betiny:preload", () => {

    /**
     * COMMANDS
     * $.arguments api is not available yet then set the command once process start.
     */

    $.arguments.add("events:list", () => {
        eventCache.map((evt, index) => {
          if (index === eventCache.length - 1) {
            $.log.end("Event:", evt);
          }
          else {
            $.log.child("Event:" , evt);
          }
        });
        process.exit();
    });

  });

};
