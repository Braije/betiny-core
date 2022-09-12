/**
 * SERVER
 * Powered by EXPRESS
 */

const _express = require('express');

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
   * But only available under 1 process :-(
   *
   * TODO: Allow encoding, decoding?
   * TODO: rename as $.store?
   */

  $.local = {
    set: (name, content) => {
      check().set(name, content);
    },
    get: name => {
      return check().get(name);
    }
  };

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
      };
    },

    instance: () => {
      return check();
    },

    engine: () => {
      return _express;
    },

    /**
     * START ...
     * TODO: Configure with JSON
     * @param  {...any} args
     */

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

        $.fire('betiny:arguments:check');

        let callback = args[2] || args[1] || args[0];
        if (typeof callback === 'function') {
          setTimeout(callback, 250);
        }

      });

      /**
       * SERVER CLOSE
       * Close properly the server on "crash".
       */

      const manageError = (e) => {

        if (e?.message) {
          $.log(e.message);
        }

        $.fire("betiny:server:error", e);

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

  const about = (what) => {
    $.log("\n");
    $.log(
        $.color.check,
        what + $.color.fgCyan,
        $.server.url()
    );
    $.log(
        $.color.space(6) + $.color.child,
        $.color.fgGray + "NODE:",
        $.color.fgGreen + process.version + $.color.reset
    );
    $.log(
      $.color.space(6) + $.color.child,
      $.color.fgGray + "PROCESS:",
      $.color.fgGreen + process.pid + $.color.reset
    );
  };

  $.on("betiny:process:start", cfg => {
    about("CHILDREN PROCESS START");
  });

  $.on("betiny:server:start", cfg => {
    about("MAIN PROCESS START");
  });

};
