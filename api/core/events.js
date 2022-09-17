
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
     * $.arguments api is not available yet then set the command once betiny preload.
     */

    $.arguments.add("events:list", () => {

      console.log(
        $.draw().space(5).icon("pipe").finish()
      );

      eventCache.map((evt, index) => {

        let last = (index === eventCache.length - 1) ? "end" : "child";

        console.log(
          $.draw().space(5).icon(last)
            .space(1).color("yellow").text(evt)
            .finish()
        );

      });

      console.log();

      process.exit();

    });

  });

};
