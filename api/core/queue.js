/**
 * QUEUE
 * TODO: Review to ES6 as class
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

    const queue = (config = { delay: 25,  continue: true }) => {

        let _cache = [], timer, 
        error = [], success = [], count = 0;

        this.add = fnc => {

            if (Array.isArray(fnc)) {
                _cache = _cache.concat(fnc);
            }
            else if (typeof fnc === 'function') {
                _cache.push(fnc);
            }

            return this;

        };

        this.execute = fnc => {

            let total = _cache.length;

            const runs = async result => {

                let exec = _cache[0];

                _cache.shift();

                count++;

                if (typeof exec === 'function') {

                    let data = await exec(result);

                    if (typeof data === 'string') {
                        error.push({
                            index: count,
                            response: data
                        });
                    }
                    else {
                        success.push({
                            index: count,
                            response: data
                        });
                    }

                    if (config.continue === false && data !== true) {

                        if (typeof fnc === 'function') {
                            fnc({
                                index: count,
                                error: error
                            });
                        }

                        return;
                    }

                    setTimeout( () => {
                        runs(data);
                    }, config.delay);

                }
                else if (typeof fnc === 'function') {
                    fnc({
                        error: error,
                        success: success,
                        total: total
                    });
                }

            };

            setTimeout(runs, config.delay);

        };

        return this;

    };

    /**
     * API
     */

    $.queue = queue;

};
