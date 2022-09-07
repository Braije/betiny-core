/**
 * CONFIG
 */

require('dotenv').config({
  path: './.env'
});

const env = (name, fallback) => {
  return process.env[name] || fallback || null;
};

module.exports = $ => {
  $.env = env;
};
