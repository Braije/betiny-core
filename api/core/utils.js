/**
 * UTILS COLLECTION
 */

module.exports = $ => {

  /**
   * ASYNC-EACH
   * https://gitlab.unistra.fr/benbassou/test-project/-/tree/master/node_modules/async-each
   */

  const each = (items, next, callback) => {

    if (!Array.isArray(items)) {
      throw new TypeError('each() expects array as first argument');
    }
    if (typeof next !== 'function') {
      throw new TypeError('each() expects function as second argument');
    }
    if (typeof callback !== 'function') {
      callback = Function.prototype;
    }
    if (items.length === 0) {
      return callback(undefined, items);
    }

    let transformed = new Array(items.length);
    let count = 0;
    let returned = false;

    items.forEach((item, index) => {
      next(item, (error, transformedItem) => {
        if (returned) {
          return;
        }
        if (error) {
          returned = true;
          return callback(error);
        }
        transformed[index] = transformedItem;
        count += 1;
        if (count === items.length) {
          return callback(undefined, transformed);
        }
      });
    });
  };

  $.each = each;

  /**
   * DELAY
   *
   * @param ms
   * @returns {Promise<unknown>}
   */

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  $.delay = delay;

  /**
   * PLACEHOLDER => replace
   * Lite templating.
   *
   * @example
   * $wt.template("<h2>{uppercase:hello} <span>{name}</span></h2>", {
   *
   *  "hello" : "Hi, ",
   *  "name" : "Christophe"
   *
   * });
   *
   * @param str {string} => XHTML AS STRING WITH {name}
   * @param placeholders {Object} => JSON OBJECT WHO'S CONTAIN { "name" : "toto" }
   * @param options {object} => JSON OBJECT for refine parameters
   *
   * @returns STRING XHTML
   */

  const replace = (str, placeholders, options) => {

    if (typeof str !== 'string') {

      return '';
    }

    // Keep placeholder if no value provide.
    var preserve = (options || {}).preserve;

    // @codingStandardsIgnoreLine
    return str.replace(/{([\w_\-\:]+)}/g, function (key, name) {

      // Convert {xxx:placeholder} => ["xxx","placeholder"].
      var useWildcard = key.replace(/{|}/g,'').split(':');

      var action = useWildcard[0];

      // Placeholder value.
      var placeholder = placeholders[useWildcard[1]] || placeholders[useWildcard[0]];

      // We want to preserve the placeholder if no value is provide.
      if (preserve && !placeholder) {
        return "{" + name + "}";
      }

      // No value, remove it.
      else if (!placeholder) {
        return "";
      }

      // Case: {lowercase:placeholder}.
      else if (action === 'lowercase') {
        return placeholder.toLowerCase();
      }

      // Case: {uppercase:placeholder}.
      else if (action === 'uppercase') {
        return placeholder.toUpperCase();
      }

      // Case: {placeholder}.
      else {
        return placeholder;
      }

    });

  };

  $.replace = replace;

  /**
   * HASH
   * Create an unique id base from string
   *
   * @param str
   * @returns {number}
   */

  const hash = str => {
    let hash = 5381;
    let i = str.length;
    while(i) {
      hash = (hash * 33) ^ str.charCodeAt(--i);
    }
    return hash >>> 0;
  };

  $.hash = hash;

  /**
   * ID
   * Return a random unique id.
   *
   * @returns {string}
   */

  const id = () => {
    return Math.random().toString(36).substr(2, 16);
  };

  $.id = id;

  /**
   * FORMAT BYTES
   *
   * @param bytes
   * @param decimals
   * @returns {string}
   */

  const formatBytes = (bytes, decimals = 2) => {

    if (bytes === 0) {
      return '0 Bytes';
    }

    let k = 1024;
    let dm = decimals < 0 ? 0 : decimals;
    let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];

  };

  $.formatBytes = formatBytes;

  /**
   * ITERATE
   * Create all combination between several array by key reference.
   *
   * SYNTAX:
   *
   *   let xxxx = iterate({
   *     key: [1,2],
   *     others: [3,4]
   *   });
   *
   * RESULT:
   *
   *  [
   *    { key: 1, others: 3},
   *    { key: 1, others: 4},
   *    { key: 2, others: 3},
   *    { key: 2, others: 4}
   *  ]
   */

  const iterate = (master, result = [{}]) => {

    // References.
    let masterKeys = Object.keys(master);
    let nextKey = masterKeys.pop();
    let nextValue = master[nextKey];
    let newObjects = [];

    // Build newObjects reference.
    for (let value of nextValue) {
      for (let x of result) {
        newObjects.push(Object.assign({ [nextKey]: value }, x));
      }
    }

    if (masterKeys.length === 0) {
      return newObjects;
    }

    let masterClone = Object.assign({}, master);
    delete masterClone[nextKey];

    return iterate(masterClone, newObjects);

  };

  $.iterate = iterate;

  /**
   * MERGE
   * Allow you to merge 2 JSON object.
   * TODO: to review
   *
   * @param defaultJSON
   * @param customJSON
   * @returns {*}
   */

  const merge = (defaultJSON, customJSON) => {

    (function recursive (a, b) {
      for (var k in b) {
        if (b.hasOwnProperty(k)) {
          if (a[k] === null) {
            a[k] = undefined;
          }
          if (typeof b[k] === "function" || typeof b[k] === "string" || typeof b[k] === "number" || typeof b[k] === "boolean" || b[k] === null ||
            (typeof b[k] === "object" && (typeof a[k] === "string" || typeof a[k] === "number" || typeof a[k] === "boolean"))) {
            a[k] = b[k];
          }
          else if (typeof b[k] === "object") {
            if (!a[k]) {
              if (b[k].length !== undefined) {
                a[k] = [];
              }
              else {
                a[k] = {};
              }
            }
            recursive(a[k], b[k]);
          }
        }
      }
    }(defaultJSON, customJSON));

    return defaultJSON;

  };

  $.merge = merge;

};
