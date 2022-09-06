/**
 * SESSION
 */

const Redis = require('ioredis');
const session = require('express-session');

module.exports = $ => {

    let count = 0;

    const redis = new Redis({
        name: "betiny",
        role: "client-requester",
        maxRetriesPerRequest: 5,
        retryStrategy (times) {
            count++;
            return 3000;
        },
        reconnectOnError (err) {
            const targetError = "READONLY";
            console.log("---", err);
            if (err.message.includes(targetError)) {
                // Only reconnect when the error contains "READONLY"
                return true; // or `return 1;`
            }
        },
    });

    redis.on("error", (err) => {
        if (err.message.includes("ECONNREFUSED")) {

            redis.disconnect();

            if (count === 0) {
                console.log(
                    $.color.space(6) + $.color.child,
                    $.color.fgGray + "SESSION",
                    $.color.fgRed + "REDIS" + $.color.reset
                );
            }
            else {
                console.log(
                    "\n" + $.color.space(5) + $.color.bgRed + $.color.fgBrightWhite + " REDIS " +
                    $.color.reset + "\n"
                );
            }

            // TODO: here switch to a memory cache on local?
        }
    });

    redis.on("ready", (err) => {
        console.log(
            $.color.space(6) + $.color.child,
            $.color.fgGray + "SESSION",
            $.color.fgGreen + "REDIS" + $.color.reset
        );
    });

    /*
    var test = redis.ping((err, result) => {
        console.log(result);
    });
    /* */

    $.middleware.add("session1", 50, session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 2,
            sameSite: true,
            secure: false
        }
    }));

    /**
     * PUBLIC
     */

    $.session = {
        init: () => {
          this.id = "_" + $.id();
        },
        get: async (key) => {
            return await $.mysql().query("SELECT userid FROM users LIMIT 0,1").catch(() => {
                return null;
            });
        },
        set: (key, value) => {

        },
        remove: (key) => {

        }
    };

};
