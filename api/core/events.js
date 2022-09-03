
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

        $.log($.color.space(6) + $.color.pipe);
        eventCache.map((evt, index) => {
          let last = (index === eventCache.length - 1) ? $.color.end : $.color.child;
          $.log(
             $.color.space(6) + last,
             $.color.fgYellow + evt + $.color.reset
          );
        });
        process.exit();
    });

  });

};
