
[Back to home](../../README.md)

# Database
Feel free to use any other database module but the Mysql come from with the default package.

    const $ = require('betiny-core'); 

## Mysql 2.0

Mysql seems the best choice once you start a new project. It's strongly support, easy to learn and portable.

A pool clustering support. Allow you to switch to another table without losing your connection.

    $.mysql( TABLE ).query( QUERY, REPLACE )

    $.mysql.install({
        file: "mydump.sql",
        dbname: yyy
    });