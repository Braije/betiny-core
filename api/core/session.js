/**
 * SESSION
 * We use REDIS to store data between 2 process.
 * 
 * TODO: Express-session seems not work from axios request :(
 */

const Redis = require('ioredis');

module.exports = $ => {

    let count = 0;
    let isRedis = false;

    /**
     * INITIALIZE CONNECTION
     */

    const redis = new Redis({
        name: "betiny",
        role: "client-requester",
        maxRetriesPerRequest: 5,
        retryStrategy (times) {
            count++;
            return 3000;
        },

        // TODO: check if it work.
        reconnectOnError (err) {
            const targetError = "READONLY";
            console.log("---", err);
            if (err.message.includes(targetError)) {

                // Only reconnect when the error contains "READONLY"
                return true; // or `return 1;`
            }
        }
    });

    /**
     * DISCONNECT ON ERROR
     */

    redis.on("error", (err) => {

        // Redis server is not joinable.
        if (err.message.includes("ECONNREFUSED")) {

            // Disconnect the client request.    
            redis.disconnect();

            // At start, not blocking issue in the list.
            if (count === 0) {
                console.log(
                    $.color.space(6) + $.color.child,
                    $.color.fgGray + "SESSION",
                    $.color.fgRed + "REDIS" + $.color.reset
                );
            }

            // If happen after the start process, drop a warning message.
            // TODO: Send an email to SYSOP? History log?
            else {
                console.log(
                    "\n" + $.color.space(5) + $.color.bgRed + $.color.fgBrightWhite + " REDIS " +
                    $.color.reset + "\n"
                );
            }

            // TODO: here switch to a memory cache on local?
        }
    });

    /**
     * DISPLAY INFO ON CONNECTION SUCCESS
     */

    redis.on("ready", (err) => {

        isRedis = true;

        console.log(
            $.color.space(6) + $.color.child,
            $.color.fgGray + "SESSION",
            $.color.fgGreen + "REDIS" + $.color.reset
        );

    });

    /**
     * PRIVATE
     * 
     * @param {*} req 
     * @returns 
     */

    const getGUID = (req) => {

        let str = Object.keys(req.headers).filter(entry => {
            return [
                "host", 
                "sec-ch-ua",
                "sec-ch-ua-mobile",
                "sec-ch-ua-platform",
                "user-agent",
                "accept-language"
            ].indexOf(entry) > -1;
            
        }).map(entry => {
            return req.headers[entry];
        });

        console.log(str);
        
        let str2 = str.join(',') + req.socket.remoteAddress;

        return $.hash(str2);
    };

    /**
     * MIDDLEWARE
     */

    // 340MB = 1 million entry.
    let memorySessionFallback = [];

    $.middleware.add("redis", 70, (req, res, next) => {

        let userSession = getGUID(req);

        req.redis = {

            id: userSession,

            get: (key) => {
                if (isRedis) {
                    return JSON.parse(redis.get(key));
                }
            },

            set: (key, value) => {
                if (isRedis) { 
                    redis.set(key, JSON.stringify(value));
                }
            },

            destroy: () => {
                if (isRedis) {
                }
            }

        };

        next();

    });

};
