/**
 * SESSION
 */

const session  = require("express-session");

module.exports = $ => {

    /**
     * REFERENCES
     */

    let client;
    let config = {
        name: "betiny-sessions",
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        maxAge: 3600,
        cookie: {
            secure: true
        }
    };

    /**
     * PUBLIC
     */

    $.session = {
        set: (key, value) => {
            return client.set(key, value);
        },
        get: async (key) => {
            return await $.mysql().query("SELECT userid FROM users LIMIT 0,1").catch(() => {
                return null;
            });
        },
        destroy: () => {}
    };

    setTimeout(() => {
        console.log('------------------', $.session.set('toto', true) );
    }, 1000);

    setTimeout(async () => {
        console.log('------------------', await $.session.get('toto') );
    }, 2000);

    /**
     * MIDDLEWARE
     */

    $.middleware.add("session", 140, session(config));

    /**
     * CHECK REDIS CONNECTION ON START
     * Drop message.rs
     */

    const check = async () => {

        // Redis bug: infinity reconnect strategy.
        client = await redis.createClient({
            legacyMode: true,
            socket: {
                reconnectStrategy: (nbr) => {
                    if (nbr < 5) {
                        return 0;
                    }
                    return new Error("No more retries.");
                }
            }
        });

        client.on('error', (err) => {
            // console.log("REDIS", err.message);
        });

        client.connect().then(() => {

            // TODO: Find a queue mechanism for checking something at start.
            setTimeout(() => {
                $.log(
                    $.color.space(6) + $.color.end,
                    $.color.fgGray + "SESSION:",
                    $.color.fgGreen + "REDIS" + $.color.reset
                );
            }, 10);

            let RedisStore = require("connect-redis")(session);

            config.store = new RedisStore({ client: client });

            $.middleware.add("session", 140, session(config));

        }).catch( err => {

            $.log(
                $.color.space(6) + $.color.end,
                $.color.fgGray + "SESSION:",
                $.color.fgRed + "REDIS" + $.color.reset,
                $.color.fgGray + "->" + $.color.reset,
                $.color.fgGreen + "MEMORY" + $.color.reset,
            );

            $.middleware.add("session", 140, session(config));

        });

    };

    //$.on("betiny:preload", check);

    $.on("betiny:server:start", () => {

        $.log(
            $.color.space(6) + $.color.child,
            $.color.fgGray + "SESSION:",
            $.color.fgRed + "WIP :(" + $.color.reset
        );

    });

};
