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
   */

  $.mysql.install = async params => {

    let file = params.file || false;
    let dbname = params.dbname || false;

    $.log.child("\33[34mMYSQL INSTALL");

    // Check first if exist.
    if(!$.file.exist(file)) {
      $.log.child("File not found");
      $.log.pipe();
      $.log.end("\33[34mFINISH");
      process.exit();
    }
    else {
      $.log.child("File found:", file.split('/').pop());
    }

    // Load file and split it into instruction.
    let instructions = await $.file.read(file, "utf8").toString().split(";").filter(command => {
      return command.trim() !== '';
    }).map(command => {
      return command.replace(/\n|\r|  /ig,' ').trim();
    });

    // $.log.child("Command(s) found:", instructions.length);

    // Create the queue
    let queue = $.queue({ delay: 25 });
    let size = instructions.length;

    // For each instructions.
    instructions.forEach(async (command, index) => {

      // We create a queue process.
      queue.push(async () => {

        let run = await $.mysql(dbname).query(command).catch(() => {
          return false;
        });

        if (run === false) {
          $.log.child("\33[31m[" + (index+1) + "/" + size + "]", command.slice(0,35) + "...");
        }
        else {
          $.log.child("\33[32m[" + (index+1) + "/" + size + "]", command.slice(0,35) + "...");
        }

      });

    });

    queue.execute(() => {
      $.log.pipe();
      $.log.end("\33[32mFINISH");
      process.exit();
    });

  };

  // Alias :-)
  $.mysql.replace = $.utils.replace;

  /**
   * EVENTS CATCHER
   */

  const checkMysql = () => {
    $.mysql().query("SELECT 1").then(() => {
      // TODO: really needed?
      // $.log.info("MYSQL", "\033[32mOK");
    }).catch(() => {
      $.log.info("MYSQL", "\033[31mCheck your MYSQL connection.");
      process.exit();
    });
  };

  $.on("betiny:server:start", checkMysql);
  //$.on("betiny:process:start", checkMysql);

};