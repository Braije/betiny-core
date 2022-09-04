/**
 * QUEUE
 * Funny test with ES6 :-)
 */

module.exports = $ => {

    /**
     * PRIVATE
     *
     * @param config
     * @returns {*}
     */

    const queue = (config = { delay: 25 }) => {

        let _cache = [], timer;

        this.push = fnc => {

            // As array.
            if (Array.isArray(fnc)) {
                _cache = _cache.concat(fnc);
            }
            else if (typeof fnc === 'function') {
                _cache.push(fnc);
            }

        };

        this.execute = async fnc => {

            const runs = async result => {

                let exec = _cache[0];

                _cache.shift();

                if (typeof exec === 'function') {
                    let data = await exec(result);
                    clearTimeout(timer);
                    timer = setTimeout( () => {
                        runs(data);
                    }, config.delay);
                }
                else if (typeof fnc === 'function') {
                    fnc();
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
