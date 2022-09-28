/**
 * BETINY SESSION
 * We use REDIS to store data between 2 process ...
 * ... with a cookie session as fallback for local.
 */

const ioredis = require('ioredis');

module.exports = $ => {

    /**
     * REFERENCES
     */

    let nbrRetry = 0;
    let isRedis = false;

    /**
     * INITIALIZE CONNECTION
     */

    const redis = new ioredis({
        name: "betiny",
        role: "client-requester",
        maxRetriesPerRequest: 1,
        retryStrategy (times) {
            nbrRetry++;
            return 300;
        }    
        // port: $.env("REDIS_PORT", 6379),
        // host: $.env("REDIS_HOST", "127.0.0.1"),
        // username: $.env("REDIS_USER"),
        // password: $.env("REDIS_PASSWORD")
    });

    /**
     * DISCONNECT ON ERROR
     */

    redis.on("error", err => {

        // Redis server is not joinable.
        if (err.message.includes("ECONNREFUSED")) {

            // Turn off global.
            isRedis = false;

            // Disconnect the client request.    
            redis.disconnect();

            // At start, not blocking issue in the list.
            if (nbrRetry === 0) {

                console.log(
                    $.draw()
                        .space(5).icon("child").color("gray").text(" SESSION ")
                        .color("red").text("REDIS").reset().text(" -> ")
                        .color("green").text("COOKIE")
                        .finish()
                );

            }

            // If happen after the start process, drop a warning message.
            // TODO: Send an email to SYSOP? History log?
            else {

                console.log(
                    $.draw().background("red").text(" REDIS ").reset()
                    .reset().text(" disconnected or offline").text("\n")
                    .finish()
                );

                $.fire("betiny:session:disconnected");

            }

        }

    });

    /**
     * DISPLAY INFO ON CONNECTION SUCCESS
     */

    redis.on("ready", () => {

        isRedis = true;

        console.log(
            $.draw()
                .space(5).icon("child").color("gray").text(" SESSION ")
                .color("green").text("REDIS").finish()
        );

        /* ALLOW TO REGISTER ANY NEW PROCESS/CHILD START 
        redis.on('message', (channel, message) => {
            console.log(message);
        });

        redis.publish("betiny-process-message", JSON.stringify({
            un: process.pid
        }));
        
        redis.subscribe('betiny-process-message');
        /* */

    });

    /**
     * PRIVATE
     */

    const encode = (data) => {
        let stringify = JSON.stringify(data);
        return Buffer.from(stringify).toString('base64');
    };

    const decode = (data) => {
        let atob = Buffer.from(data, 'base64').toString('binary');
        return JSON.parse(atob);
    };

    const validate = (what) => {
        return (what === false) ? false : (what || null);
    };

    const get = (obj, path) => {
        return path.split(/[\.\[\]\'\"]/).filter(p => p).reduce((o, p) => {
            return o ? validate(o[p]) : null;
        }, obj);
    };

    const set = (obj, path, value) => {
        path.split('.').reduce((o,p,i) => {
            return o[p] = path.split('.').length === ++i ? value : o[p] || {};
        }, obj);
        return obj;
    };

    const copy = (obj, from, to) => {
        var val = get(obj, from);
        if (val || val === false) {
            set(obj, to, val);
        }

        return obj;
    };

    const move = (obj, from, to) => {
        copy(obj, from, to);
        var path = from.split('.');
        while (path.length > 1) {
            let key = path.shift();
            if (obj && obj[key]) {
                obj = obj[key];
            }
        }
        delete obj[path[0]];
    };

    /**
     * PRIVATE SESSION 
     */

    const session = {

        /**
         * GET GUID
         * Same as google analytics or piwik :)
         * We extract as much as possible common stats from user request to build a GUID.
         * 
         * @param {*} req 
         * @returns 
         */

        guid: (req) => {

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
    
            let str2 = str.join(',') + req.socket.remoteAddress;
            let hash = $.hash(str2);
    
            return hash;
        },

        /**
         * GET SESSION
         * 
         * @param {*} path 
         * @param {*} sessionID 
         * @param {*} req 
         * @param {*} res 
         * @returns
         */

        get: (path, sessionID, req, res) => {

            if (isRedis) {

                return redis.get(sessionID).then(code => {

                    let reply = {};

                    if (code) {
                        reply = decode(code);
                    }
 
                    if (path && reply) {
                        reply = get(reply, path)
                    }

                    return reply || {};

                }).catch(() => {});

            }
            
            return new Promise((resolve, reject) => {

                let cooks = {};

                const cookieHeader = req.headers?.cookie;
                if (!cookieHeader) {
                    resolve(cooks);
                    return;
                }

                cookieHeader.split(";").map(cookie => {
                    let [ name, ...rest] = cookie.split("=");
                    name = name?.trim();

                    if (!name || !name.startsWith("betiny_")) {
                        return;
                    }
                    let value = rest.join("=").trim();
                    if (!value) {
                        return;
                    }
                    cooks = decode(value);
                });

                if (path) {
                    cooks = get(cooks, path);
                }

                resolve(cooks);
                return;

            });

        },

        /**
         * SET SESSION
         * 
         * @param {*} path 
         * @param {*} value 
         * @param {*} maxage 
         * @param {*} req 
         * @param {*} res 
         */

        set: (path, value, maxage = (60 * 60 * 24 * 7), sessionID, req, res) => {

            if (!path || !value) {
                return;
            }

            // Get a fresh version.
            return session.get(false, sessionID, req, res).then(data => {

                // TODO: Why it return true?
                if (data === true) {
                    return;
                } 

                // Update path.
                let refresh = set(data, path, value);

                // REDIS.
                if (isRedis) {
                    
                    // Remove "return" to use cookie session all the time as fallback?
                    redis.set(sessionID, encode(refresh), "EX", maxage);
                }

                // FALLBACK => COOKIE SESSION
                let opts = [
                    sessionID + "=" + encode(refresh),
                    "SameSite=Lax",
                    "HttpOnly",
                    "Secure"
                ].join("; ");

                res.setHeader("Set-Cookie", opts);

            }); 

        }
        
    };

    /**
     * MIDDLEWARE
     * A custom session middleware :-)
     */

    $.middleware.add("betiny-session", 150, (req, res, next) => {

        // Unique session id based on requester input.
        let sessionID = "betiny_" + session.guid(req);

        // Extend property.
        req.session = {
            id: sessionID,
            get: (path) => {
                return session.get(path, sessionID, req, res);
            },
            set: (path, value, maxage = (60 * 60 * 24 * 7)) => {
                return session.set(path, value, maxage, sessionID, req, res);
            }
        };

        // Auto-clear cookie when REDIS is available.
        if (isRedis) {
            res.clearCookie(sessionID);
        }

        next();

    });

};
