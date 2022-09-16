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

  $.on("betiny:test", () => {

    $.mysql.install({
      file: "install.sql",
      dbname: "test"
    });

  });

  $.mysql.install = async params => {

    let file = params.file || false;
    let dbname = params.dbname || false;

    //console.log($.draw().space(5).icon("top").finish());

    // Check first if exist.
    if(!$.file.exist(file)) {

      console.log(
        $.draw()
          .icon("error")
          .space(1)
          .color("red").text("MYSQL").space(1)
          .color("gray").text("INSTALL").reset()
          .text("\n").space(5).icon("top")
          .text("\n").space(5).icon("end")
          .text(" File ").color("red").text( file.split('/').pop() )
          .reset().text(" not found \n")
          .finish()
      );

      process.exit();

    }
    else {

      console.log(
        $.draw()
          .icon("check")
          .space(1)
          .color("green").text("MYSQL").space(1)
          .color("gray").text("INSTALL").reset()
          .text("\n").space(5).icon("top")
          .text("\n").space(5).icon("end")
          .text(" File ").color("green").text( file.split('/').pop() )
          .reset().text(" found\n")
          .finish()
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
    let queue = $.queue();

    // For each instructions.
    instructions.forEach(async (command, index) => {

      queue.add(async () => {

        let run = await $.mysql(dbname).query(command).catch(() => {
          return false;
        });

        if (run === false) {

          console.log(
            $.draw()
              .space(7)
              .space(1)
              .color("red").text("[" + (index+1) + "/" + size + "] ").reset()
              .color("gray").text(command.slice(0,35) + "...")
              .finish()
          );

        }
        else {

          console.log(
            $.draw()
              .space(7)
              .space(1)
              .color("green").text("[" + (index+1) + "/" + size + "] ").reset()
              .color("gray").text(command.slice(0,35) + "...")
              .finish()
          );

        }

      });

    });

    queue.execute(() => {
      console.log("\n");
      process.exit();
    });

  };

  /**
   * EVENTS CATCHER
   */

  $.on("betiny:preload", async () => {

    if (!$.env("MYSQL_HOST")) {
      
      console.log(
        $.draw().background("red").text(" MYSQL ").reset()
        .reset().text(" Check your .env configuration").text("\n")
        .finish()
      );

      process.exit();

    }

  });

  const checkOnStart = async  () => {

    await $.mysql().query("SELECT 1").catch(() => {

      console.log(
        $.draw().background("red").text(" MYSQL ").reset()
        .reset().text(" Check your connection.").text("\n")
        .finish()
      );

      process.exit();

    }).then(() => {

      console.log(
        $.draw().space(5).icon("end").color("gray").text(" DATABASE: ")
        .color("green").text("MYSQL").text("\n")
        .finish()
      );

    });

  };

  $.on("betiny:server:start", checkOnStart);
  $.on("betiny:process:start", checkOnStart);

};
