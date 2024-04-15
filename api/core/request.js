/**
 * REQUEST
 * Node.js v16.4+ use fetch natively as experimental.
 * Node.js v18.16+ use fetch natively as official :-)
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/fetch
 * https://jsonplaceholder.typicode.com/users
 */

/* HTTP STATUS CODE

100	Continue
101	Switching protocols
102	Processing
103	Early Hints

200	OK
201	Created
202	Accepted
203 Non-Authoritative Information
204	No Content
205	Reset Content
206	Partial Content
207	Multi-Status
208	Already Reported
226	IM Used

300	Multiple Choices
301	Moved Permanently
302	Found (Previously "Moved Temporarily")
303	See Other
304	Not Modified
305	Use Proxy
306	Switch Proxy
307	Temporary Redirect
308	Permanent Redirect

400	Bad Request
401	Unauthorized
402	Payment Required
403	Forbidden
404	Not Found
405	Method Not Allowed
406	Not Acceptable
407	Proxy Authentication Required
408	Request Timeout
409	Conflict
410	Gone
411	Length Required
412	Precondition Failed
413	Payload Too Large
414	URI Too Long
415	Unsupported Media Type
416	Range Not Satisfiable
417	Expectation Failed
418	I'm a Teapot
421	Misdirected Request
422	Unprocessable Entity
423	Locked
424	Failed Dependency
425	Too Early
426	Upgrade Required
428	Precondition Required
429	Too Many Requests
431	Request Header Fields Too Large
451	Unavailable For Legal Reasons

500	Internal Server Error
501	Not Implemented
502	Bad Gateway
503	Service Unavailable
504	Gateway Timeout
505	HTTP Version Not Supported
506	Variant Also Negotiates
507	Insufficient Storage
508	Loop Detected
510	Not Extended
511	Network Authentication Required

*/

module.exports = $ => {

    /**
     * MAIN REQUESTER
     * WIP ....
     *
     * TODO: manage others content-type later :(
     *
     * @param {*} url
     * @param {*} options
     * @returns
     */

    const request = (url, options = {}) => {

        /**
         * STATS
         * We want an estimation time took for each request.
         */

        let timeMS = process.hrtime();

        /**
         * DEFAULT PARAMETERS
         */

        let params = { ... {

            // Retry on "fetch failed".
            retry: 3,

            // Force an error after x ms.
            timeout: 15000,

            // follow || error || manual
            // redirect: "follow",

            // cors || no-cors || same-origin
            // mode: "cors",

            // default || no-store || reload || no-cache || force-cache || only-if-cached
            // cache: "default",

            // GET || POST
            // method: "GET",

            // omit || same-origin || include
            // credentials: "include",

            // no-referrer || client || URL
            // referrer: "client",

            // no-referrer || no-referrer-when-downgrade ||
            // origin || origin-when-cross-origin || unsafe-url
            // referrerPolicy: "origin",

            // Allow the request to outlive the page
            // keepalive: false,

            // Allows you to communicate with a fetch request and abort it if desired.
            // signal: true,

            // USE BY POST
            // headers: "",
            // body: "",

            // NOT USE.
            // integrity: ""

        }, ...options};

        /**
         * HRTIME to MS
         * Convert an HRTIME value to MS
         */

        const toMs = () => {

            // The end[0] is in seconds, end[1] is in nanoseconds
            var end = process.hrtime(timeMS);

            // Convert first to ns then to ms
            const timeInMs = (end[0]* 1000000000 + end[1]) / 1000000;

            // Format as number.
            return Number((timeInMs+"").split(".")[0]);

        };

        /**
         * FETCH
         * Wrap inside a promise to manage root error.
         */

        return new Promise((resolve, reject) => {

            /**
             * LONG POOLING
             * We force an error on long pooling request.
             */

            let timer = setTimeout(() => {

                reject({
                    code: 408,
                    response: "Request Timeout: " + params.timeout,
                    time: toMs()
                });

            }, params.timeout);

            /**
             * UNMANAGE ERROR
             * We want to manage unmanage error :-)
             */

            try {

                /**
                 * FETCH
                 * Fetch is natively support as experimental based on node.js 16.4+
                 */

                return fetch(url, params).then(async res => {

                    /**
                     * CONTENT TYPE
                     * Based on this property we can adapt the response.
                     */

                    let contentType = res.headers.get("content-type");

                    /**
                     * VALID RESPONSE
                     */

                    if (res.ok && res.status === 200) {

                        // Cancel the long pooling fallback.
                        clearTimeout(timer);

                        /**
                         * THE RESULT :-)
                         * This is the default...
                         */

                        let result = "";

                        /**
                         * RESPONSE JSON
                         */

                        if (contentType.includes('json')) {
                            result = await res.json();
                        }

                        /**
                         * RESPONSE TEXT
                         * TODO: manage blob, stream...
                         */

                        else {
                            result = await res.text();
                        }

                        /**
                         * REPLY
                         */

                        resolve({
                            code: res.status,
                            response: result,
                            time: toMs()
                        });

                    }

                    /**
                     * INVALID RESPONSE
                     * We want to manage invalid response.
                     */

                    else {

                        reject({
                            code: res.status,
                            response: "Response was not ok",
                            time: toMs()
                        });

                    }

                /**
                 * ERROR FOM FETCH API
                 * Manage custom error based on fetch api.
                 */

                }).catch(async err => {

                    clearTimeout(timer);

                    params.retry--;

                    // Unmanage error.
                    // https://github.com/nodejs/undici/issues/1248
                    if (params.retry && err.message === "fetch failed") {

                        await $.delay(Math.random() * params.retry * 100);

                        await request(url, params).then(reData => {
                            resolve(reData);
                        }).catch(async err => {

                            params.retry--;

                            await $.delay(Math.random() * params.retry * 100);

                            await request(url, params).then(reData => {
                                resolve(reData);
                            }).catch( err => {
                                reject('Failed on retry');
                            });

                        })

                    }

                    else {

                        reject({
                            code: 501,
                            response: "Not Implemented: " + err.message,
                            time: toMs()
                        });

                    }

                })

            }

            /**
             * UNMANAGE ERROR
             * Unmanage error based on fetch api.
             */

            catch(e) {

                reject({
                    code: 600,
                    response: e.message,
                    time: toMs()
                });

            }

        });

    };

    $.request = request;

    /**
     * TEST AREA :)
     */

    $.on("betiny:test", async () => {

        return;

        await $.delay(250);

        let timeMS = process.hrtime();
        let countCheck = 0;

        let queue = $.queue({ delay: 0, continue: true, thread: 3 });

        [...Array(1500)].map((e, index) => {

            queue.add(async () => {

                let d = Math.round(Math.random() * (Math.random() * index));
                await $.delay(d);

                console.log(index, d);

                return true;
            });

            return;

            if (index === 4) {
                queue.add(async () => {
                    await $.delay(50);
                    console.log("ERROR on", index);
                    return "Error";
                });
            }

            queue.add(async () => {

                return await request("http://127.0.0.1:3033/random")
                .then(res => {
                    console.log("ok", index, countCheck, res);
                    countCheck++;
                    return res;
                })
                .catch(e => {
                    console.log("ERROR", index,  e);
                    return e.response || e;
                });

            })

        });

        queue.execute((stats) => {

            const toMs = () => {

                // The end[0] is in seconds, end[1] is in nanoseconds
                var end = process.hrtime(timeMS);

                // Convert first to ns then to ms
                const timeInMs = (end[0]* 1000000000 + end[1]) / 1000000;

                // Format as number.
                return Number((timeInMs+"").split(".")[0]);

            };

            console.log(
                "\nSEQUENCE: ERROR: ",
                stats.error.length,
                "SUCCESS: ", stats.success.length,
                " ON", Math.round(toMs() / 1000), "seconds",
                // stats.error.map(res => res.response),
                // stats.success.map(res => res.index)
            )
        });

    });

};
