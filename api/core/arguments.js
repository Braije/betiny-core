/**
 * ARGUMENTS
 */

module.exports = $ => {

  /**
   * REFERENCES
   */

  let _arguments = {};

  /**
   * PRIVATE
   *
   * @param refname
   * @param data
   * @returns {Promise<void>}
   */

  const run = async (refname, data = []) => {

    // Create collection reference.
    if (refname) {

      let collection = [];
      let reference = $.arguments.list();
      let referenceKey = Object.keys(reference);

      $.log(
          "\n" + $.color.plus,
          "RUNNING",
          $.color.fgYellow,
          refname.toUpperCase()
      );

      referenceKey.map(entry => {
        if (entry.startsWith(refname)) {
          collection = collection.concat(reference[entry]);
        }
      });

      collection.map((entry, index) => {

        data.push(async () => {

          let success = await (async () => {
            return await entry() || true;
          })();

          if (success) {
            run(false, data);
          }

        });

      });

    }

    let entry = data[0];

    if (entry) {
      data.shift();
      entry();
    }

  };

  /**
   * PUBLIC
   */

  $.arguments = {

    /**
     * LIST
     * Return the list of all arguments (commands) as object.
     *
     * @returns {{}}
     */

    list: () => {
      return _arguments;
    },

    /**
     * ADD NEW ARGUMENTS
     *
     * @param name
     * @param callback
     */

    add: (name, callback) => {

      if (!_arguments[name]) {
        _arguments[name] = [];
      }

      // ------------------------------------------
      //  FROM
      // ------------------------------------------
      //  yarn start xxx:yyy a:2222 b:4444
      // ------------------------------------------
      //  TO
      // ------------------------------------------
      //  { a: "2222", b: "4444" }
      // ------------------------------------------

      let params = {};
      process.argv.slice(3, process.argv.length).map(entry => {
        let arguments = entry.split(":");
        params[arguments[0]] = arguments[1];
      });

      _arguments[name].push(async () => {
        return await callback(params);
      });

    },

    /**
     * RUN
     * Run command from API based on name.
     *
     * @param name {string} - argument's name
     */

    run: (name) => {
      if (_arguments[name]) {
        run(name);
      }
    }

  };

  /**
   * EVENTS CATCHER
   */

  // On child process, we handle arguments in the shell and forward it.
  $.on('betiny:process:start', async () => {

    await $.delay(50);

    let haveSubProcess = process.argv.slice(2, process.argv.length);
    if (haveSubProcess.length) {
      if (_arguments[haveSubProcess[0]]) {
        run(haveSubProcess[0]);
      }
      else {
        $.log(
            "\n" + $.color.error,
            "RUNNING",
            $.color.fgYellow + haveSubProcess[0],
            $.color.reset + "doesn't exist!\n"
        );
        process.exit();
      }
    }

  });

  /**
   * COMMANDS
   */

  $.arguments.add('arguments:list', params => {

    let arguments = Object.keys($.arguments.list());

    $.log($.color.space(6) + $.color.pipe);

    arguments.map( (args, index) => {
      let last = (index === arguments.length - 1) ? $.color.end : $.color.child;
      $.log($.color.space(6) + last,
          $.color.fgGray + "yarn start",
          $.color.fgYellow + args + $.color.reset
      );
    });

    $.log();

    process.exit();

  });

};
