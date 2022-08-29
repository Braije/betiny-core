/**
 * JOB
 * Similar to queue but each element of the queue should return
 * a boolean value to process next one.
 *
 * SYNTAX
 *
 *    $.job("Description of JOB", PARAMS)
 *      .task("Task description", FUNCTION)
 *      .task("Another description task", [FUNCTION, FUNCTION])
 *      .execute( (total, error) => {
 *        ...
 *      });
 *
 */

module.exports = $ => {

  /**
   * PUBLIC
   */

  $.job = (name, config = {}) => {

    /**
     * REFERENCES.
     */

    config = $.merge({
      console: true,
      delay: 125
    }, config);

    this.params = {};
    this.tasks = [];
    this.name = name;
    this.count = 1;
    this.total = 0;
    this.error = [];
    this.progress = false;

    /**
     * PRIVATE
     *
     * @returns {Promise<void>}
     */

    const queue = async () => {

      if (this.progress) {
        return;
      }

      this.progress = true;

      // The file to be load.
      let item = this.tasks[0];

      if (item) {

        this.tasks = this.tasks.slice(1, this.tasks.length);

        if (config.console !== false) {
          $.log.pipe(" \033[0m[  ]\033[32m  " + item.description);
        }

        this.params = await item.job(this.params);

        setTimeout( () => {

          if (this.params) {

            this.progress = false;

            this.count++;

            if (config.console !== false) {
              $.log.back();
              $.log.pipe(" \033[32m[OK]\033[90m  " + item.description);
            }

            setTimeout(queue, config.delay);

          }

          // ERROR
          else {

            this.error.push(item.description);

            if (config.continue) {

              if (config.console !== false) {
                $.log.back();
                $.log.pipe(" \033[33m[SK]\033[0m  " + item.description);
              }

              this.progress = false;

              setTimeout(queue, config.delay);

            }
            else {

              if (config.console !== false) {
                $.log.back();
                $.log.pipe(" \033[31m[KO]\033[0m  " + item.description);
              }

              process.exit();
            }

          }

        }, config.delay);

      }

      // End of job.
      else {

        $.log.pipe("");
        $.log.end("END");

        if (this.callback) {
          this.callback(this.total, this.error);
        }

        this.tasks = [];
        this.name = name;
        this.count = 1;
        this.total = 0;
        this.error = [];
        this.progress = false;
        this.params = {};

        // Implicite call at the end of each job for install and test.
        if ($.next) {
          $.next();
        }

      }

    };

    /**
     * PRIVATE
     *
     * @param desc
     * @param fnc
     */

    const add = (desc, fnc) => {

      // Increment counter.
      this.total++;

      // Push to job queue.
      this.tasks.push({
        description: desc,
        job: fnc
      });

    };

    /**
     * PUBLIC
     *
     * @param desc {string}
     * @param fnc {function}
     * @returns {*}
     */

    this.task = (desc, fnc) => {

      // As array => Push every task in job queue.
      if (Array.isArray(fnc)) {
        fnc.forEach( (item, index) => {
          add(desc + " | " + (index+1), item);
        });
      }

      // As single task;
      else {
        add(desc, fnc);
      }

      return this;

    };

    /**
     * PUBLIC
     *
     * @param fnc {function}
     */

    this.execute = fnc => {

      this.callback = fnc;

      if (config.console !== false) {
        $.log.child("JOB", this.name);
        $.log.pipe("");
      }

      queue();

    };

    return this;

  };

};
