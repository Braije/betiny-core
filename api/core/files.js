/**
 * FILES
 * TODO:
 */

const glob = require('fast-glob');
const path = require('path');
const fs = require('fs');

module.exports = $ => {

  $.file = {
    exist: file => {
      return fs.existsSync(file);
    },
    read: (...args) => {
      return fs.readFileSync(...args);
    },
    write: () => {

    },
    dir: async (path, options) => {
      return await glob.sync(path, options);
    },
    upload: () => {

    },
    delete: () => {

    }
  }

};
