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

    redis.on("ready", () => {

        isRedis = true;

        console.log(
            $.color.space(6) + $.color.child,
            $.color.fgGray + "SESSION",
            $.color.fgGreen + "REDIS" + $.color.reset
        );

    });

    /**
     * GET GUID
     * Same as google analytics or piwik :)
     * We extract as much as possible common stats from user request to build a GUID.
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

        // console.log(str); 
        
        let str2 = str.join(',') + req.socket.remoteAddress;

        return $.hash(str2);
    };

    /**
     * MIDDLEWARE
     */

    // TODO: fallback version if redis down :)
    // 340MB = 1 million entry.
    let memorySessionFallback = [];

    $.middleware.add("redis", 70, async (req, res, next) => {

        // Unique session id based on requester input.
        let sessionID = "session_" + getGUID(req);

        /*
        await redis.set(sessionID, JSON.stringify({
            name: 'Roberta McDonald',
            toto: "tutu"    
        })); 
        /* */
        

        // Extend property.
        req.session = {

            id: sessionID,

            get: async (key) => {

                if (isRedis) {

                    //console.log("REDIS", sessionID);

                    return await redis.get(sessionID).then(res => {

                        if (res) {
                            return JSON.parse(res);
                        }
                        else {
                            return {};
                        }

                    }).catch( err => {
                        return {};
                    });
                }
                
            },

            set: async (key, value, maxage = (60 * 60 * 24 * 7)) => {
                if (isRedis) { 
                    redis.set(key, JSON.stringify(value), "EX", maxage);
                }
            },

            remove: () => {
                if (isRedis) {
                    // TODO: really needed?
                }
            }

        }; 

        next();

    });

};
