/**
 * PROCESS CHILD
 * We use fork for flexibility and exchange between both.
 *
 * HOW TO - FROM PARENT
 *
 *  // Use "child" to forward "$" reference
 *  const child = $.process.child("child.js");
 *
 *  // Use "fork" if not necessary
 *  const child = $.process.fork("child.js");
 *
 *  child.on("message", msg => { ... });
 *  child.on("error", (code, signal) => { ... });
 *  child.send({ hello: "world" });
 *
 * HOW TO - FROM CHILD ("child.js")
 *
 *  process.on("message", msg => { ... });
 *  process.send({ hello: "world" });
 *  process.exit();
 */

const { exec, fork } = require('child_process');

module.exports = $ => {

  $.process = {

    // Use to forward "app" to the child process.
    child: file => {
      const mod = require(file);
      if (typeof mod === 'function') {
        mod($);
      }
    },

    // Use to run child without "app"
    fork: fork,

    // Use to run shell command.
    shell: exec

  }

};
