/**
 * ROUTE
 */

module.exports = $ => {

  /**
   * REFERENCES
   */

  let _instance = $.server.instance();
  let _engine = $.server.engine();

  let routes = {
    get: [],
    post: [],
    put: [],
    delete: [],
    static: []
  };

  /**
   * ORDERING MIDDELWARE BY PRIORITY ON EACH ROUTE
   * Allow adding dynamically any middleware anywhere :-)
   *
   * @param args
   * @returns {{path: *, renderer: *, middlewares: betinyRouteConfig[], error: error}}
   */

  const buildChain = (...args) => {

    let path = args[0];
    let config = (typeof args[1] === 'object');
    let callback = args[args.length - 1];

    let middlewares = [betinyRouteConfig = (req, res, next) => {
      req.betiny = config ? args[1] : {};
      next();
    }]
    // .concat($.middleware.chain());
    .concat((req, res, next) => {

      $.each($.middleware.chain(), (fn, callback) => {
        fn(req, res, callback);
      }, next);

    });

    return {
      path: path,
      middlewares: middlewares,
      renderer: callback,

      // TODO: manage error 404 ...
      error: (req, res) => {
        $.log("End of routes\n");
        res.json({
          error: "End of road :-)",
        });
      }

    };

  };

  /**
   * PUBLIC
   */

  $.route = {

    /**
     *
     * @param method {string} - optional - route method (get, post, ...)
     * @returns {{static: *[], post: *[], get: *[], delete: *[], put: *[]}|{}}
     */

    details: method => {
      if (method) {
        let temp = {};
        temp[method] = routes[method];
        return temp;
      }
      return routes;
    },

    get: (...args) => {
      let chain = buildChain(...args);
      routes.get.push(chain);
      return _instance.get(chain.path, chain.middlewares, chain.renderer, chain.error);
    },

    post: (...args) => {
      let chain = buildChain(...args);
      routes.post.push(chain);
      return _instance.post(chain.path, chain.middlewares, chain.renderer, chain.error);
    },

    put: (...args) => {
      let chain = buildChain(...args);
      routes.put.push(chain);
      return _instance.put(chain.path, chain.middlewares, chain.renderer, chain.error);
    },

    delete: (...args) => {
      let chain = buildChain(...args);
      routes.delete.push(chain);
      return _instance.delete(chain.path, chain.middlewares, chain.renderer, chain.error);
    },

    static: (...args) => {
      routes.static.push(args[0]);
      if (args.length === 2) {
        _instance.use(args[0], _engine.static(args[1]));
      }
      else {
        _engine.static(args[0]);
      }
    }

  };

  /**
   * COMMANDS
   */

  $.arguments.add('routes:list', async params => {

    let list = $.route.details(params.method);
    let methods = Object.keys(list);
    let url = $.server.url();

    methods.map(method => {

      $.log("");
      $.log(
          $.color.space(4),
          $.color.fgYellow + method.toUpperCase(),
          $.color.reset
      );

      let size = false;

      if (list[method]) {

        size = list[method].length;

        list[method].map((entry, index) => {
          let last = (index === size - 1) ? $.color.end : $.color.child;
          $.log(
              $.color.space(6) + last,
              url + entry.path,
              $.color.reset
          );
        });

      }

      if (!size) {
        $.log(
            $.color.space(6) + $.color.end,
            "No routes define"
        );
      }

    });

    process.exit();

  });

};
