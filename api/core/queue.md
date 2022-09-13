[Back to home](../../README.md)

## Queue
Allow you to run sequentially a huge amount of methods with less impact of ressources. The queue `CONFIG` contains few parameters:

    $.queue({ delay: 50, continue: false })
        .add( FNC )
        .add( [FNC, FNC] )
        .execute( CALLBACK )

| Parameters | Description | Type |
| --- | :-- | :-- |
| delay | Delay time in ms between 2 functions. <br /> **Default:** 25 | NUMBER |
| continue | Allow you to stop the queue on error (false). <br /> **Default:** true | BOOLEAN |


### .add( FNC || ARRAY )
Each `FNC` will be trigger with the response of the previous `FNC`. The `add` method allow you to push a single method or an array of methods collection.

### .execute( CALLBACK )
The `execute` method will run the queue sequentially. The `callback` method will be trigger when the queue end with some `stats` information to let you perform some other actions based on


    $.queue()
        .add(() => {
            return "My custom error message"
        })
        .add(res => {
            console.log(res) // My custom error message
            return true
        })
        .add([
            res => { ... }, 
            res => { ... }
        ])
        .execute(stats => {
            console.log(stats) // { error: [...], success: 1 }
        }) 
