#### Memo :)

    yarn test   => mocha **/*.test.js --reporter ./api/reporter.js
    yarn dev    => dev mode
    yarn start  => single process mode
    yarn prod   => cluster process mode (PM2)
    
    yarn start betiny:test => internal tools

# About
A backend service using a custom wrapper API. Alternative version of Betiny to let you manage yourself the directory structure.

## Install
As usual ... :-)

    yarn add betiny-core

### Config
Create your own ".env" and fill it 
with your own informations :)

    HTTP_PORT=3001
    HTTP_HOST=127.0.0.1
    
    ROOT_PATH=

    # Read/write folder
    TEMP_PATH=
    
    MYSQL_HOST=localhost
    MYSQL_PORT=3306
    MYSQL_USER=root
    MYSQL_PASSWORD=
    MYSQL_CONNECTION_LIMIT=100
    MYSQL_DATABASE=betiny

## Usage
Your root file can look like:

    // index.js
    const $ = require('betiny-core');

    // Your own organisation folders etc.
    require("./toto/titi");
    require("./tata/tutu/tete");

    // ...
    $.server.start(() => { ... });

Others files:

    // ./toto/titi/index.js
    const $ = require('betiny-core');
    
    // Start using any API

# API

### SYSTEM

    $.env
    $.log

### EVENTS

    $.fire
    $.on
    $.off   
    $.once

### UTILS

    $.replace
    $.formatBytes
    $.iterate
    $.id
    $.hash
    $.delay
    $.merge
    $.each

### SERVER

    $.server.start( FNC )
    $.server.url( PATH )

### ARGUMENTS

    $.arguments.add( NAME, FNC )

    // List of existing command
    yarn start arguments:list

### MYSQL 2.0
A pool clustering support. Allow you to switch to another table without losing your connection.

    $.mysql( TABLE ).query( QUERY, REPLACE )

    $.mysql.install({
        file: "mydump.sql",
        dbname: yyy
    });

### MIDDELWARE

    $.middleware.add( NAME, PRIORITY, ROUTE );

### ROUTE ( WIP )

    $.route.get
    $.route.post
    $.route.put
    $.route.delete

### STORAGE ( WIP )

    $.local.set
    $.local.get
    $.local.env

### FILES ( WIP )

    $.file.xxx

### OTHERS (~)
   
    $.queue( NAME, OPTIONS )
        .describe( NAME )
        .task( NAME, FNC )
        .set( ARRAY_COLLECTION )
        .each( FNC )
        .run( FNC )
