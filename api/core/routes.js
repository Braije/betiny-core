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
   * COMMANDS
   */

  $.arguments.add('routes:list', async params => {

    $.log.back();
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.moveCursor(0,-1);
    console.log("\n");

    let list = $.route.details(params.method || {});
    let methods = Object.keys(list);
    let url = $.server.url();

    methods.map(method => {

      $.log.top("\33[32m" + method.toUpperCase());

      let size = list[method].length;

      list[method].map((entry, index) => {
        if (index === size - 1) {
          $.log.end(url + entry.path);
        }
        else {
          $.log.child(url + entry.path);
        }
      });

      if (!size) {
        $.log.end("No routes define");
      }

    });

    process.exit();
  });

};
