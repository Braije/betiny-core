[Back to home](../../README.md)

## Server
No surprise, server use [Express](https://expressjs.com/) behind the scene :-)

### $.server.start(port, callback)
The `port` and `callback` are optional.

    // Basic
    $.server.start()

    // Force PORT
    $.server.start(3003)

    // Perform ACTION on start
    $.server.start(() => {
        ... ACTION ...
    })

    // BOTH
    $.server.start(3003, () => {
        ...
    })