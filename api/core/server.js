
const _express = require('express');

/**
 * SERVER
 */

module.exports = $ => {

  const check = () => {

    if (!this.engine) {
      this.engine = _express();
    }

    return this.engine;

  };

  /**
   * LOCAL
   * Native feature that come from express :-)
   * TODO: Allow encoding, decoding?
   * TODO: rename as $.store?
   */

  $.local = $.local || {};

  $.local.set = (name, content) => {
    check().set(name, content);
  };

  $.local.get = name => {
    return check().get(name);
  };

  $.local.env = $.env;

  /**
   * SERVER
   */

  let port = $.env("HTTP_PORT", 3001);
  let hostname = $.env("HTTP_HOST", "127.0.0.1");

  $.server = {

    url: (section = "") => {
      return $.server.info().url + section;
    },

    info: () => {
      return {
        mode: $.env('MODE'),
        port: port,
        host: hostname,
        url: 'http://' + hostname + ':' + port
      }
    },

    instance: () => {
      return check();
    },

    engine: () => {
      return _express;
    },

    start: (...args) => {

      this.engine = check();

      port = Number((typeof args[0] === 'number') ? args[0] : port);
      hostname = (typeof args[1] === 'string') ? args[1] : hostname;

      // Switch to another port if process already running.
      port = (process.argv.slice(2).length) ? 3002 : port;

      let isMain = port === Number($.env("HTTP_PORT", 0));

      let eventName = (isMain) ? "betiny:server:start" : "betiny:process:start";

      $.fire(eventName, {
        port: port,
        hostname: hostname,
        isMain: isMain
      });

      let server = this.engine.listen(port, hostname, () => {
        if (typeof (args[2] || args[1] || args[0]) === 'function') {
          (args[3] || args[1] || args[0])();
        }
      });

      /**
       * SERVER CLOSE
       * Close properly the server on "crash".
       */

      const manageError = (e) => {

        if (e?.message) {
          console.log(e.message);
        }

        $.fire("betiny:server:error");

        server.close(() => {
          $.fire("betiny:server:close");
        });

      };

      process.on('exit', manageError);
      process.on('SIGINT', manageError);
      process.on('SIGUSR1', manageError);
      process.on('SIGUSR2', manageError);
      process.on('uncaughtException', manageError);

    }

  };

  /**
   * EVENTS CATCHER (START)
   */

  $.on("betiny:process:start", cfg => {
    console.clear();
    console.log("\n");
    $.log.success("CHILDREN PROCESS START", $.server.url() );
    $.log.end("PROCESS ID", process.pid);
  });

  $.on("betiny:server:start", cfg => {
    console.log("\n");
    $.log.success("MAIN PROCESS START", $.server.url());
    $.log.end("PROCESS ID", process.pid);
  });

};
