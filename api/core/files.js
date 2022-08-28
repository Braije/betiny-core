/**
 * FILES
 * TODO:
 */

const _path = require('path');
const fs = require('fs');

module.exports = $ => {

  $.folder = {
    exist: (path) => {
      return fs.existsSync(path);
    },
    create: (path) => {
      let exist = $.folder.exist(path);
      return (exist) ? exist : !!fs.mkdirSync(path, { recursive: true });
    },
    delete: (path) => {
      fs.rmdirSync(path, { recursive: true, force: true });

      return !$.folder.exist(path);
    }
  };

  /**
   * CHECK FOLDER
   * Utility for deep folder creation.
   *
   * @param filePath {string} - any folder path
   * @returns {boolean}
   */

  const checkFolder = filePath => {
    var dirname = _path.dirname(filePath);
    if (fs.existsSync(dirname)) {
      return true;
    }
    checkFolder(dirname);
    fs.mkdirSync(dirname, { recursive: true });
  }

  // TODO: Turn all into promise?
  $.file = {

    stats: fileOrFolder => {
      try {

        // Get info.
        let info = fs.statSync(fileOrFolder);

        let result = {
          file: false,
          directory: false,
          size: info.size,
          creation: info.birthtime,
          update: info.mtime,
          access: info.atime,
          change: info.ctime
        }

        // File.
        if (info.isFile) {
          result.file = info.isFile();
        }

        if (info.isDirectory) {
          result.directory = info.isDirectory();
        }

        // Keep control over it.
        return result;
      }
      catch (e) {
        return {}
      }
    },

    exist: fileorFolder => {
      return fs.existsSync(fileorFolder);
    },

    read: fileOrFolder => {

      let info = $.file.stats(fileOrFolder);

      if (info.file) {
        try {
          return fs.readFileSync(fileOrFolder, "utf8");
        } catch (e) {
          return "";
        }
      }
      else if (info.directory) {
        try {
          let list = fs.readdirSync(fileOrFolder);
          return {
            folders: list.filter(fold => fold.indexOf(".") === -1),
            files: list.filter(fold => fold.indexOf(".") > -1)
          };
        } catch (e) {
          return {
            folders: [],
            files: []
          };
        }
      }
      else {
        return "";
      }

    },

    // TODO: Restrict operations into TEMP_PATH folder
    create: (fileOrFolder = "", data = "") => {

      let temp = $.env('TEMP_PATH', false);

      if (!temp) {
        return "Your TEMP_PATH folder is not defined in your .env";
      }

      // Only path inside temp folder.
      let path = _path.resolve(temp, fileOrFolder);

      // Only inside temp folder => ../../hack
      if (path.indexOf(temp) === -1) {
        return "Haha well try.";
      }

      // Check path valid string and format => ./.toto/tu.tu@/tata
      if (/[\.\[\]#%&{}<>*?\s\b\0$!'"@|‘“+^`]/.test( _path.parse(path).dir )) {
        return "Invalid path";
      }

      let isFile = path.indexOf(".") > -1;

      console.log(path, _path.basename(path));

      checkFolder(path);

      // FILES.
      if (isFile) {
        fs.writeFileSync(path, data);
        return $.file.exist(path);
      }

      // DIRECTORY
      else {
        let exist = $.folder.exist(path);

        return "PATH: " + path;
        //return (exist) ? exist : !!fs.mkdirSync(fileOrFolder, { recursive: true });
      }

    },

    // TODO: Restrict operations into TEMP_PATH folder
    delete: (path) => {
      fs.unlinkSync(path);
      return !$.file.exist(path);
    }

  }

  $.on("betiny:preload", () => {

    console.clear();

    let toto = $.file.create(".toto/tutu.js");

    console.log( toto );

    process.exit();

  });

};
