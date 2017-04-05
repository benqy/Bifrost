
export default {
    /**
     * 根据文件后缀名判断http head的content-type
     */
    getContentType: function (pathname:string) {
        let dirReg = /(^.*)\/(.*\..*)$/,
            dirArr = dirReg.exec(pathname),
            filename,
            header = {};
        dirArr && (filename = dirArr[2]);
        if (!filename) {
            header['content-type'] = 'text/html';
        } else if (~filename.indexOf('.js')) {
            header['content-type'] = 'application/x-javascript';
        } else if (~filename.indexOf('.html') || ~filename.indexOf('.shtml') || ~filename.indexOf('.htm')) {
            header['content-type'] = 'text/html';
        } else if (~filename.indexOf('.css')) {
            header['content-type'] = 'text/css';
        } else if (~filename.indexOf('.xml')) {
            header['content-type'] = 'application/xml';
        } else if (~filename.indexOf('.json')) {
            header['content-type'] = 'application/json';
        } else if (~filename.indexOf('.jpg')) {
            header['content-type'] = 'image/jpeg';
        } else if (~filename.indexOf('.png')) {
            header['content-type'] = 'image/png';
        } else if (~filename.indexOf('.gif')) {
            header['content-type'] = 'image/gif';
        } else if (~filename.indexOf('.bmp')) {
            header['content-type'] = 'image/bmp';
        } else if (~filename.indexOf('.ico')) {
            header['content-type'] = 'image/x-icon';
        } else {
            header['content-type'] = 'text/plain';
        }
        return header;
    }
}