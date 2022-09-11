[Back to home](../../README.md)

## Middleware
Maybe the most flexible part of this framework.

### $.middleware.add(NAME, PRIORITY, METHOD)
Allow you to add any middleware at any time with priority order in your business logic.

    $.middleware.add("test", 200, (req, res, next) => {

        next();
    })
