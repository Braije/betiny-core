/**
 * FILE SYSTEM
 */

const _path = require('path');
const fs = require('fs');

module.exports = $ => {

  /**
   * SECURE PATH
   * Limit the path to TEMP_PATH folder.
   *
   * @param fileOrFolder {string} - any folder path
   * @returns {string|boolean}
   */

  const securePath = fileOrFolder => {

    let temp = $.env('TEMP_PATH', false);

    if (!temp) {
      // $.log("Your TEMP_PATH folder is not defined in your .env");
      return false;
    }

    let path = "";

    // Reset folder path => TEMP_PATH/toto/tutu => /toto/tutu
    if (fileOrFolder.indexOf(temp) > -1) {
      path = fileOrFolder;
    }

    // Root path reference => /toto/tutu
    else if (fileOrFolder.startsWith('/')) {
      path = _path.resolve(temp + fileOrFolder);
    }

    // Only path inside temp folder => TEMP_PATH/toto/tutu
    else {
      path = _path.resolve(temp, fileOrFolder);
    }

    // Only inside temp folder => ../../hack
    if (path.indexOf(temp) === -1) {
      // $.log("You can access only inside the TEMP_PATH");
      return false;
    }

    // Check path valid string and format => ./.toto/tu.tu@/tata
    if (/[.\[\]#%&{}<>*?\s\b\0$!'"@|‘“+^`]/.test( _path.parse(path).dir )) {
      // $.log("Your path contain invalid string");
      return false;
    }

    return path;

  };

  /**
   * PUBLIC
   * TODO: Turn all into promise?
   */

  $.file = {

    /**
     * GET STATS
     *
     * @param fileOrFolder {string} - any path
     * @returns {{
     *    file: boolean,
     *    access: Date,
     *    size: number,
     *    change: Date,
     *    update: Date,
     *    directory: boolean,
     *    creation: Date
     *  }|{}}
     */

    stats: fileOrFolder => {

      let path = securePath(fileOrFolder);

      if (!path) {
        return {};
      }

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

    /**
     * EXIST
     *
     * @param fileOrFolder {string} - any path
     * @returns {boolean}
     */

    exist: fileOrFolder => {

      let path = securePath(fileOrFolder);

      if (!path || fileOrFolder.trim() === '') {
        return false;
      }

      return fs.existsSync(path);

    },

    /**
     * READ
     *
     * @param fileOrFolder {string} - any path
     * @param options {object} - TODO: optional
     * @returns {{
     *    folders: [],
     *    files: []
     * }}
     */

    read: (fileOrFolder, options) => {

      let path = securePath(fileOrFolder);

      if (!path) {

        // As file.
        if (_path.parse(fileOrFolder).ext) {
          return false;
        }

        return {
          folders: [],
          files: []
        };

      }

      let info = $.file.stats(path);

      if (info.file) {
        try {
          return fs.readFileSync(path, "utf8");
        } catch (e) {
          return null;
        }

      }
      else if (info.directory) {
        try {
          let list = fs.readdirSync(path);
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

        // As file.
        if (_path.parse(fileOrFolder).ext) {
          return false;
        }

        return {
          folders: [],
          files: []
        };
      }

    },

    /**
     * CREATE
     *
     * @param fileOrFolder
     * @param data
     * @returns {string|boolean}
     */

    create: (fileOrFolder = "", data = "") => {

      let path = securePath(fileOrFolder);

      if (!path) {
        return false;
      }

      // TODO: review, using stats!
      let isFile = path.indexOf(".") > -1;

      // FILES.
      if (isFile) {

        let isInvalid = /[\[\]#%&{}<>*?\s\b\0$!'"@|‘“+^`]/.test( path );
        if (isInvalid) {
          return false;
        }

        fs.writeFileSync(path, data);
        return $.file.exist(path);
      }

      // DIRECTORY
      else {

        let isInvalid = /[.\[\]#%&{}<>*?\s\b\0$!'"@|‘“+^`]/.test( path );
        if (isInvalid) {
          return false;
        }

        let exist = $.file.exist(path);
        return (exist) ? exist : !!fs.mkdirSync(path, { recursive: true });
      }

    },

    /**
     * DELETE
     * TODO:
     *
     * @param fileOrFolder
     * @returns {boolean}
     */

    delete: (fileOrFolder) => {

      let path = securePath(fileOrFolder);

      if (!path) {
        return false;
      }

      let info = $.file.stats(path);

      if (info.file) {
        fs.unlinkSync(path);
        return !$.file.exist(path);
      }
      else if (info.directory) {

        if (path === $.env("TEMP_PATH", false)) {
          return false;
        }

        fs.rmdirSync(path, { recursive: true, force: true });
        return !$.file.exist(path);
      }
      else {
        return false;
      }

    }

  }

};
