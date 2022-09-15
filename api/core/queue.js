/**
 * QUEUE
 */

module.exports = $ => {

    /**
     * PRIVATE
     * Allow you to run sequentially a huge amount of methods with less impact of ressources.
     * 
     *  $.queue( CONFIG ).add( FNC ).add( [FNC, FNC] ).execute( CALLBACK )
     * 
     * @param config
     * @returns {*}
     */

    const queue = (params = {}) => {

        /**
         * PRIVATE
         */

        let cache = [], 
            error = [], 
            success = [], 
            count = 0, 
            timer;

        /**
         * CONFIG
         */

        let config = { ...{ 

            delay: 25,  
            continue: true,
            thread: 1

        }, ...params};

        /**
         * ADD
         * Allow you to push one or an array of functions.
         * 
         * @param {*} fnc
         * @returns 
         */

        this.add = fnc => {

            if (Array.isArray(fnc)) {
                cache = cache.concat(fnc);
            }
            else if (typeof fnc === 'function') {
                cache.push(fnc);
            }

            return this;

        };

        /**
         * EXECUTE
         * Run the queue sequentially or as thread pipeline.
         * Partially inspired by https://github.com/rxaviers/async-pool#readme
         * 
         * @param {*} fnc 
         */

        this.execute = async fnc => {

            let total = cache.length;

            const executing = new Set();

            const refresh = async () => {
                const [instance] = await Promise.race(executing);
                executing.delete(instance);
            };

            const terminate = () => {

                if (typeof fnc === 'function') {

                    fnc({
                        error: error,
                        success: success,
                        total: total
                    });
    
                }

            };

            const distribute = (data, index) => {

                // A string response is = ERROR.
                if (typeof data === 'string') {

                    error.push({
                        index: index,
                        response: data
                    });

                }

                // Otherwise register as success.
                else {

                    success.push({
                        index: index,
                        response: data
                    });

                }

            };

            // Sequentially.
            if (config.thread === 1) {

                // Throttle
                (throttle = async () => {

                    let current = cache[0];

                    cache.shift();

                    if (current) {

                        let data = await current();

                        distribute(data, count);

                        if (config.continue === false && error.length) {
                            terminate();
                            return;
                        }

                        count++;

                        setTimeout(throttle, config.delay);

                    }
                    else {

                        terminate();

                    }

                })();

                return; 
            }

            // Thread.
            cache.map(async (fnc, index) => {

                const promise = (async () => {

                    return await fnc();

                })().then((data) => {
                    
                    distribute(data, index);

                }).then(() => {

                    return [promise];

                }); 

                executing.add(promise);
                
                if (executing.size >= config.thread) {
                    await refresh();
                }
    
            })

            while (executing.size) {
                await refresh();
            }

            terminate();
           
        };

        return this;

    };

    /**
     * API
     */

    $.queue = queue;

};
