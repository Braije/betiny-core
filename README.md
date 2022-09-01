# About
A backend service using a custom wrapper API. Alternative version of Betiny to let you manage yourself the directory structure.

## Install
As usual ... :-)

    yarn add betiny-core

### Config
Rename ".env-sample" to ".env" and fill it 
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

### Usage

    const $ = require('betiny-core');

    $.server.start(() => { ... });

# API

### SYSTEM

    $.env
    $.log.xxx
    $.process.xxx

### EVENTS

    $.fire
    $.on
    $.off   
    $.once

### UTILS

    $.replace
    $.formatBytes
    $.iterate

    $.utils.id
    $.utils.hash
    $.utils.delay
    $.utils.merge

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
Should be setup before any $.route declaration :-)

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
   
    $.job( NAME, OPTIONS ).task( NAME, FNC ).execute( FNC )
