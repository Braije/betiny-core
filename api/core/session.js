/**
 * SESSION
 * We use REDIS to store data between 2 process.
 * 
 * TODO: Express-session seems not work from axios request :(
 */

const ioredis = require('ioredis');

module.exports = $ => {

    /**
     * REFERENCES
     */

    let count = 0;
    let isRedis = false;

    /**
     * INITIALIZE CONNECTION
     */

    const redis = new ioredis({
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
     * COOKIES
     * 
     * @param {*} request 
     * @returns 
     */
    
    const getCookie = (request) => {
        const list = {};
        const cookieHeader = request.headers?.cookie;
        if (!cookieHeader) {
            console.log(request.headers);
            return list;
        }

        cookieHeader.split(`;`).forEach((cookie) => {
            let [ name, ...rest] = cookie.split(`=`);
            name = name?.trim();
            if (!name) {
                return;
            }
            const value = rest.join(`=`).trim();
            if (!value) {
                return;
            }
            list[name] = value;
        });
    
        return list;
    };

    const setCookie = (res, name, value, domain, secure, httpOnly, expires, path) => {
        let opts = {
          domain,
          secure,
          httpOnly,
          expires: new Date(expires),
          path
        };
        return append(res, "Set-Cookie", cookie_1.serialize(name, value, opts));
    };

    /**
     * MIDDLEWARE
     * TODO: fallback version if redis down :)
     */

    $.middleware.add("session-redis", 160, async (req, res, next) => {

        // Unique session id based on requester input.
        let sessionID = "session_" + getGUID(req);

        // Extend property.
        req.session = {

            // Public.
            id: sessionID,

            // Promise return.
            get: (path) => {

                if (isRedis) {

                    return redis.get(sessionID).then(code => {
                        
                        let response = decode(code);

                        if (path) {
                            return get(response, path);
                        }

                        return response;

                    }).catch(() => {
                        return {};
                    });

                }

                return {};

            },

            set: (path, value, maxage = (60 * 60 * 24 * 7)) => {

                if (isRedis) { 
                    
                    if (path && value) {

                        req.session.get().then(data => {

                            set(data, path, value);

                            redis.set(sessionID, encode(data), "EX", maxage);

                        }); 
                        
                    }

                }

            }


        };

        next();

    });

};
