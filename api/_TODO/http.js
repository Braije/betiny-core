/**
 * HTTP REQUEST
 * This collection is for internal usage.
 */

const axios = require('axios');

module.exports = $ => {

  // axios.defaults.baseURL = 'http://localhost:3001';

  // Important: If axios is used with multiple domains, the AUTH_TOKEN will be sent to all of them.
  // See below for an example using Custom instance defaults instead.
  // TODO: for client side only!
  // axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

  // axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

  let srvInfo = $.server.info();

  axios.defaults.withCredentials = true;

  let api = axios.create({
    baseURL: srvInfo.url,
    timeout: 3000,
    withCredentials: true
  });

  $.http = {
    defaults: api.defaults,
    get: api.get,
    post: api.post,
    put: api.put,
    delete: api.delete,
    header: api.head
  };

};
