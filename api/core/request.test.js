const $ = require("../index.js");
const assert = require('assert');

describe('Request', () => {

    // TODO: root path server, mock?
    // TODO: https://jsonplaceholder.typicode.com/users

    const tests = [
        { 
            desc: "Relative 1 should failed.",
            expect: false,    
            url: "/"
        },
        { 
            desc: "Relative 2 should failed.",
            expect: false,    
            url: "./" 
        },
        { 
            desc: "Relative 3 should failed.",
            expect: false,    
            url: "../"
        },
        { 
            desc: "Root should return true",
            expect: true,     
            url: "http://127.0.0.1:3033"
        },
        { 
            desc: "Unexisting url should return false",
            expect: false,    
            url: "http://127.0.0.1:3033/unexisting"
        },
        { 
            desc: "An existing https site should return true",
            expect: true,     
            url: "https://google.com"
        },
        { 
            desc: "Drop connection on timeout: 1000",
            expect: false,    
            url: "http://127.0.0.1:3033/wait5sec", 
            params: { timeout: 1000 }
        },
        { 
            desc: "Wait 5 secondes",
            expect: true,     
            url: "http://127.0.0.1:3033/wait5sec" 
        },
        {  
            desc: "Long pool connection should failed after 15 secondes (default)",
            expect: false,    
            url: "http://127.0.0.1:3033/timeout15sec" 
        }
    ];

    tests.map(row => {

        it (row.desc, async () => {

            let test = await $.request(row.url, row.params || {}).then(_ => { 
                return true  
            }).catch(_ => { 
                return false  
            });

            assert.equal(test, row.expect); 

        });

    })

});
