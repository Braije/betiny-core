/**
 * MIDDLEWARE
 */

const helmet = require("helmet");
const compression = require("compression");

module.exports = $ => {

  /**
   * REFERENCES
   */

  let _priority = [];
  let _chain = false;

  /**
   * PUBLIC
   */

  $.middleware = {

    /**
     * LIST
     * Return the list as OBJECT of middleware based on priority order.
     *
     * @param temp {object} - init variable
     * @returns {{}}
     */

    list: (temp = {}) => {
      _priority.forEach((item, index) => {
        temp[index] = {
          name: item.name,
          fnc: item.fnc
        }
      });
      return temp;
    },

    /**
     * CHAIN
     * Return all middleware in array based on priority order.
     *
     * @returns {array}
     */

    chain: () => {
      if (!_chain) {
        let list = $.middleware.list();
        _chain = Object.keys(list).map(entry => {
          return list[entry].fnc
        });
      }
      return _chain;
    },

    /**
     * GET
     * Allow you to retrieve middleware based on name.
     *
     * @param name {string} - middleware's name
     * @returns {*[]}
     */

    get: name => {
      return _priority.filter(item => {
        return item.name === name;
      });
    },

    /**
     * ADD
     * Allow you to add new middleware with priority order.
     *
     * @param name {string} - middleware's name
     * @param priority {number} - priority order
     * @param fnc {function} - callback function => (req, res, next)
     */

    add: (name, priority, fnc) => {

      if (name && priority && fnc) {
        _priority[priority] = {
          fnc: fnc,
          name: name,
          priority: priority
        };
      }

    }

  };

  /**
   * SETUP DEFAULT
   * TODO: Make it configurable?
   */

  let instance = $.server.instance();
  let engine = $.server.engine();

  instance.set('trust proxy', 1);
  instance.set('etag', false);
  instance.disable('x-powered-by');

  $.middleware.add("helmet", 100, helmet());
  $.middleware.add("compression", 120, compression());
  $.middleware.add("json_limit", 140, engine.json({ limit: '10MB', extended: true }));
  $.middleware.add("urlencoded_limit", 150, engine.urlencoded({ limit: '10MB', extended: true }));

  /**
   * COMMANDS
   */

  $.arguments.add('middleware:list', async () => {

    let list = $.middleware.list();
    let keys = Object.keys(list);

    $.log($.color.space(6) + $.color.pipe);

    keys.map((mid, index) => {
      let last = (index === keys.length - 1) ? $.color.end : $.color.child;
      $.log($.color.space(6) + last,
          $.color.fgYellow + mid + $.color.reset,
          list[mid].name
      );
    });

    $.log();

    process.exit();

  });

};
