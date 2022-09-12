/**
 * REQUEST
 * Node.js v16.4+ use fetch natively as experimental.
 * 
 * https://developer.mozilla.org/en-US/docs/Web/API/fetch
 * https://jsonplaceholder.typicode.com/users
 */

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

    const get = () => {

        return new Promise((resolve, reject) => {

        });

    };

    $.request = {
        get: () => {},
        post: () => {},
        stream: () => {}
    }

 };
