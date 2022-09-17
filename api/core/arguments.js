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

      console.log(
        $.draw()
          .icon("check").space(1).background("green").text(" RUNNING ").reset().space(1)
          .color("gray").text(refname)
          .finish()
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
  $.on('betiny:arguments:check', async () => {

    // Delay to let preload process do some change.
    await $.delay(500);

    let haveSubProcess = process.argv.slice(2, process.argv.length);
    if (haveSubProcess.length) {
      if (_arguments[haveSubProcess[0]]) {
        run(haveSubProcess[0]);
      }
      else {

        console.log(
          $.draw()
            .icon("error").space(1).background("red").text(" RUNNING ").reset().space(2)
            .color("red").text(haveSubProcess[0])
            .space(1).reset().text(" doesn't exist!\n")
            .finish()
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

    console.log(
      $.draw().space(5).icon("pipe").finish()
    );

    arguments.map( (args, index) => {

      let last = (index === arguments.length - 1) ? "end" : "child";

      console.log(
        $.draw().space(5).icon(last)
          .space(1).color('gray').text("yarn start")
          .space(1).color("yellow").text(args)
          .finish()
      );

    });

    console.log();

    process.exit();

  });

};
