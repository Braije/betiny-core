/**
 * QUEUE
 * Alllow you to push in queue any function ...
 * each of them will be execute one by one.
 * The goal is to avoid an overlapping memory usage like
 * usual with any promise approach or classic loop method.
 *
 * SYNTAX
 *
 *    let myQueue = $wt.queue(OPTIONS);
 *    myQueue.push([fnc,fnc...]);
 *    myQueue.push(fnc);
 *    myQueue.execute(callback);
 *
 * NOTE: each return value is forward to the next method as
 * parameter.
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

}
