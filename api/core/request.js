/**
 * REQUEST
 * Node.js v16.4+ use fetch natively as experimental.
 * 
 * https://developer.mozilla.org/en-US/docs/Web/API/fetch
 * https://jsonplaceholder.typicode.com/users
 */

//const puppeteer = require('puppeteer');

module.exports = $ => {

    /*
    fetch('http://127.0.0.1:3033', { 

        method: "GET", // POST

        credentials: "include" // omit || same-origin || include 

        // cache: "", // default, no-store, reload, no-cache, force-cache, and only-if-cached
        // redirect: "",  // follow, error, manual
        // headers: "",
        // body: "",
        // mode: "cors", // cors || no-cors || same-origin
        // referrer : "",
        // referrerPolicy: "",
        // integrity = "",
        // keepalive = "",
        // signal = ""

    }).then(res => {

    });
    */

    const get = (url, options = {}) => {

        // Default.
        let params = { ... {
            timeout: 15000
        }, options}; 

        // Wrap inside a promise to manage root error.
        return new Promise((resolve, reject) => {

            // For the lonnng pooling request.
            let timer;

            try {
                return fetch(url, {}).then(async res => {

                    console.log(res.ok, res.status, params.timeout)

                    // Fallback for long pooling.
                    timer = setTimeout(() => {
                        reject({code: 602, response: "Time out"});
                    }, params.timeout);

                    // 
                    if (res.ok && res.status === 200) {

                        clearTimeout(timer);

                        let txt = await res.text();

                        let json = false;

                        try {
                            json = JSON.parse(txt);
                        }
                        catch(e) {
                            json = txt;
                        }

                        resolve({code: 200, response: json});

                    }
                    else {
                        reject({code: 601, response: "Response not ok"});
                    }
                    

                }).catch(e => {

                    reject({code: 600, response: e.message });

                })
            }
            catch(e) {
                reject(e.message);
            }

        });

    };

    $.on("betiny:test", async () => {

        await get("http://127.0.0.1:3033")
            .then(res => console.log(res))
            .catch(e => console.log(e));

        await get("/")
            .then(res => console.log(res))
            .catch(e => console.log(e));

        /*await get("https://jsonplaceholder.typicode.com/users")
            .then(res => console.log(res))
            .catch(e => console.log(e));*/

            

    });

    $.browser = {
        get: () => {},
        visit: () => {}
    };

    $.http = {
        visit: () => {
            // puppeteer
        },
        get: () => {
            // fetch
        },
        post: () => {
            // fetch
        },
        stream: () => {
            // axios
        }
    }

 };
