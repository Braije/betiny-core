/**
 * FILES
 * TODO:
 */

const path = require('path');
const fs = require('fs');
const $ = require("../index");

module.exports = $ => {

  $.folder = {
    exist: (path) => {
      return fs.existsSync(path);
    },
    read: (path) => {
      return fs.readdirSync(path);
    },
    create: (path) => {
      let exist = $.folder.exist(path);
      return (exist) ? exist : !!fs.mkdirSync(path, { recursive: true });
    },
    delete: (path) => {
      fs.rmdirSync(path, { recursive: true, force: true });

      return !$.folder.exist(path);
    }
  };

  $.file = {
    exist: file => {
      return fs.existsSync(file);
    },
    read: (...args) => {
      return fs.readFileSync(...args);
    },
    create: (path, data) => {
      fs.writeFileSync(path, data);
      return $.file.exist(path);
    },
    delete: (path) => {
      fs.unlinkSync(path);
      return !$.file.exist(path);
    }
  }

};
