
[Back to home](../../README.md)

**TODO:** Provide a read/write stream data.

## FILE SYSTEM
To increase the security, the file system is restricted to "TEMP_PATH" (.env) folder.
The file system prevent any access outside this folder! All methods are sync.

### $.file.stats(path)
All path reference is related to the TEMP_PATH folder.

    $.file.stats("/"); // See below
    $.file.stats("../hack"); // {} 
    $.file.stats("./any/file.txt"); // See below

On error the response is always an empty JSON object. On succes, the response is:

    {
        file:       BOOLEAN,
        directory:  BOOLEAN,
        size:       NUMBER,
        creation:   DATE,
        update:     DATE,
        access:     DATE,
        change:     DATE
    }
   

### $.file.exist(path)
All path reference is related to the TEMP_PATH folder.

    $.file.exist("./") // true
    $.file.exist("../hack") // false
    $.file.exist("exist.txt") // true
    $.file.exist("./folder/path/unexisting.js") // false

### $.file.read(path)
All path reference is related to the TEMP_PATH folder.

    $.file.read("/");

On error (empty array) or succes, the response is always the same for a folder request:

    {
        folders: ["folder_a", "folder_b"],
        files: ["file_a.txt", "file_b.js"]
    }

The response for a file request can be an empty string on error.

    $.file.read("./any/where/file.txt");

(!) No stream data are available yet.


### $.file.create(path, data)
All path reference is related to the TEMP_PATH folder.

    $.file.create("/newfolder");
    $.file.create("/newfolder/file.txt", "any data");

### $.file.delete(path)
 
    $.file.delete("./folder");
    $.file.delete("/folder/file.txt");