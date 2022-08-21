/**
 * ROUTE
 */

module.exports = $ => {

  let _instance = $.server.instance();
  let _engine = $.server.engine();

  let routes = {
    get: [],
    post: [],
    put: [],
    delete: []
  };

  /**
   * ORDERING MIDDELWARE BY PRIORITY ON EACH ROUTE
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
    }].concat($.middleware.chain());

    return {
      path: path,
      middlewares: middlewares,
      renderer: callback,

      // TODO: manage error 404 ...
      error: (req, res) => {
        $.log.debug("End of routes\n");
        res.json({
          error: "End of road :-)",
        });
      }

    };

  };

  $.route = {

    details: collection => {
      return routes[collection] || routes;
    },
    paths: collection => {
      let list = $.route.details(collection);

      if (Array.isArray(list)) {
        return list.map(entry => {
          return entry.path;
        });
      }
      else {

        let all = {};

        Object.keys(list).map( key => {
          all[key] = list[key].map(entry => {
            return entry.path;
          });
        });

        return all;
      }

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
      if (args.length === 2) {
        _instance.use(args[0], _engine.static(args[1]));
      }
      else {
        _engine.static(args[0]);
      }
    }

  }

  /**
   * MIDDLEWARE
   * Trace when debug is enable
   */

  /* TODO: really needed? Dev prefer using their own log :-)
  $.middleware.add("REQUEST DEBUG INFO", 10, (req, res, next) => {
    if ($.env("DEBUG") === "true") {
      console.log("");
      $.log.info("REQUEST", req.method, req.originalUrl);
    }
    next();
  });*/

  /**
   * COMMANDS
   */

  $.arguments.add('routes:details', async () => {
    console.log($.route.details());
  });
  $.arguments.add('routes:get', async () => {
    console.log($.route.details('get'));
  });
  $.arguments.add('routes:post', async () => {
    console.log($.route.details('post'));
  });
  $.arguments.add('routes:put', async () => {
    console.log($.route.details('put'));
  });
  $.arguments.add('routes:delete', async () => {
    console.log($.route.details('delete'));
  });
  $.arguments.add('routes:paths', async () => {
    console.log($.route.paths());
  });
  $.arguments.add('routes:api', async () => {
    console.log($.route);
  });

};
