import * as path from 'path';
import * as fs from 'fs';

export default {
    /**
     * 根据文件后缀名判断http head的content-type
     */
    getContentType(pathname: string) {
        let dirReg = /(^.*)\/(.*\..*)$/,
            dirArr = dirReg.exec(pathname),
            filename,
            header = '';
        dirArr && (filename = dirArr[2]);
        if (!filename) {
            header = 'text/html';
        } else if (~filename.indexOf('.js')) {
            header = 'application/x-javascript';
        } else if (~filename.indexOf('.html') || ~filename.indexOf('.shtml') || ~filename.indexOf('.htm')) {
            header = 'text/html';
        } else if (~filename.indexOf('.css')) {
            header = 'text/css';
        } else if (~filename.indexOf('.xml')) {
            header = 'application/xml';
        } else if (~filename.indexOf('.json')) {
            header = 'application/json';
        } else if (~filename.indexOf('.jpg')) {
            header = 'image/jpeg';
        } else if (~filename.indexOf('.png')) {
            header = 'image/png';
        } else if (~filename.indexOf('.gif')) {
            header = 'image/gif';
        } else if (~filename.indexOf('.bmp')) {
            header = 'image/bmp';
        } else if (~filename.indexOf('.ico')) {
            header = 'image/x-icon';
        } else {
            header = 'text/plain';
        }
        return header;
    },

    isfile(filepath) {
        return fs.statSync(filepath).isFile();
    },

    isdir(filepath) {
        return fs.statSync(filepath).isDirectory();
    },

    dirname(filepath) {
        return filepath.dirname(path).replace(/\\/g, '/');
    }
}