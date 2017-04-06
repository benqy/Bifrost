import * as http from 'http';
import * as url  from 'url';
import * as path from 'path';
import * as fs from 'fs';
import util from './util'


class WebServer {
    private _server;

    public readonly options = {
        port: 80,
        rootPath: '/'
    };

    constructor(options) {
        this.options = options;
        this._server = http.createServer(this._webHandler.bind(this));
    }

    private _webHandler(req, res) {
        let urlOpt = url.parse(req.url, true);
        this._handlerStaticFile(urlOpt, req, res);
    }

    private _handlerStaticFile(urlOpt, req, res) {
        let resData = '';
        let header = {'content-type':util.getContentType(urlOpt.pathname)};
        let filepath = require('path').resolve(this.options.rootPath + urlOpt.path.split('?')[0]);
        filepath = decodeURIComponent(filepath);
        if (!fs.existsSync(filepath)) {
            res.writeHead(404, header);
            resData = '文件不存在:' + filepath;
            res.end(resData);
        }
        else if (fs.statSync(filepath).isDirectory()) {
            resData = this._renderDir(urlOpt, filepath);
            res.writeHead(200, header);
            res.end(resData);
        }
        else {
            res.writeHead(200, header);
            resData = fs.readFileSync(filepath).toString();
            res.end(resData);
        }
    }

    /**
     * 列出目录
     */
    private _renderDir(urlOpt, dir) {
        if (!fs.existsSync(dir)) return '';
        var files = fs.readdirSync(dir), resData = '<h3>' + dir + '</h3>', href = '';
        files.forEach((file) => {
            href = (urlOpt.href + '/' + file).replace(/((\:?)\/{1,})/g, ($m, $1, $2) => { return $2 ? $1 : '/'; });
            resData += '<a href="' + href + '">' + file + '</a></br>';
        });
        return resData;
    }

    on() {
        this._server.listen(this.options.port);
        //console.log(`webserver on ${this.options.port}`);
    }

    off() {
        console.log('')
    }
}

export { WebServer };