/**
 * MySql 2.0 using Pool as promise.
 *
 * HOW TO USE IT
 *
 *  // Syntax.
 *  $.mysql( DATABASE ).query( QUERY, PLACEHOLDER );
 *
 *  // Example.
 *  $.mysql('security').query("SELECT * FROM security_service").then( result => { ... });
 *
 *  // PLACEHOLDER
 *  $.mysql('abis').query("UPDATE jobs SET isrunning='2', result=? WHERE id=?", [{ .... }, 123]);
 */

const mysql = require('mysql2');

module.exports = $ => {

  // References.
  const poolCluster = [];

  /**
   * SWITCH TO ANOTHER DATABASE ON THE FLY
   *
   * @param database
   * @returns {object} Pool connection
   */

  const switchDatabase = database => {

    if (poolCluster[database]) {
      return poolCluster[database];
    }

    return poolCluster[database] = mysql.createPool({
      waitForConnections: true,
      queueLimit: 0,
      connectionLimit: $.env('MYSQL_CONNECTION_LIMIT', 100),
      host: $.env('MYSQL_HOST', "localhost"),
      user: $.env('MYSQL_USER', "root"),
      password: $.env('MYSQL_PASSWORD', ""),
      database: database || $.env('MYSQL_DATABASE', "betiny"),
      port: $.env('MYSQL_PORT', 3306)
    });

  };

  /**
   * WRAPPER
   *
   * @param database {string} - TODO: database name
   * @returns {*}
   */

  $.mysql = database => {

    let pool = switchDatabase(database);

    this.query = (query, placeholder = null) => {

      return (new Promise( (resolve, reject) => {

        return pool.query(query, placeholder, (error, result) => {
          if (error) {
            return reject(error.sqlMessage || error.message);
          }
          return resolve(result || []);
        });

      }));

    };

    return this;

  };

  /**
   * INSTALL DATABASE
   * Based on external file (dump sql).
   * TODO: $.file.read/exist is restricted to TEMP_PATH!
   *
   * @param params {object}
   */

  $.mysql.install = async params => {

    let file = params.file || false;
    let dbname = params.dbname || false;

    $.log($.color.space(6) + $.color.top);

    // Check first if exist.
    if(!$.file.exist(file)) {
      $.log($.color.space(6) + $.color.end,
          $.color.fgBlue + "MYSQL INSTALL" + $.color.reset + "\n",
          $.color.space(8) + "File " +
          $.color.fgRed +  file.split('/').pop() +  $.color.reset +
          " not found"
      );
      process.exit();
    }
    else {
      $.log($.color.space(6) + $.color.end,
          $.color.fgBlue + "MYSQL INSTALL" + $.color.reset,
          file.split('/').pop()
      );
    }

    // Load file and split it into instruction.
    let instructions = await $.file.read(file, "utf8").toString().split(";").filter(command => {
      return command.trim() !== '';
    }).map(command => {
      return command.replace(/\n|\r|  /ig,' ').trim();
    });

    // Create the queue
    let size = instructions.length;
    let queue = $.queue("MYSQL");

    // For each instructions.
    instructions.forEach(async (command, index) => {

      queue.push(async () => {

        let run = await $.mysql(dbname).query(command).catch(() => {
          return false;
        });

        if (run === false) {
          $.log(
              $.color.space(8) + $.color.fgRed,
              "[" + (index+1) + "/" + size + "]" + $.color.fgGray,
              command.slice(0,35) + "..." + $.color.reset
          );
        }
        else {
          $.log(
              $.color.space(8) + $.color.fgGreen,
              "[" + (index+1) + "/" + size + "]" + $.color.fgGray,
              command.slice(0,35) + "..." + $.color.reset
          );
        }

      });

    });

    queue.execute(() => {
      process.exit();
    })

  };

  /**
   * EVENTS CATCHER
   */

  $.on("betiny:preload", async () => {
    if (!$.env("MYSQL_HOST")) {
      $.log(
          "\n" + $.color.error,
          "MYSQL",
          "Check your .env configuration"
      );
      process.exit();
    }
  });

  const checkOnStart = async  () => {
    await $.mysql().query("SELECT 1").catch(() => {
      $.log(
          "\n" + $.color.error,
          "MYSQL",
          "Check your connection."
      );
      process.exit();
    }).then(() => {
      $.log(
          $.color.space(6) + $.color.end,
          $.color.fgGray + "DATABASE:",
          $.color.fgGreen + "MYSQL" + $.color.reset
      );
    })
  };

  $.on("betiny:server:start", checkOnStart);
  $.on("betiny:process:start", checkOnStart);

};
