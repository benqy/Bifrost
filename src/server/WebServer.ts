const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

import util from './util'


class WebServer {
    private _webServer;

    public readonly options = {
        port:10086,
        rootPath:'/'
    };

    constructor(options) {
        this.options = options;
        this._webServer = http.createServer(this._webHandler.bind(this));
    }

    private _webHandler(req, res) {
        let urlOpt = url.parse(req.url, true);
        this._handlerStaticFile(urlOpt,req, res);
    }

    private _handlerStaticFile(urlOpt,req, res) {
        let resData = '';
        let header = util.getContentType(urlOpt.pathname);
        let filepath = require('path').resolve(this.options.rootPath + urlOpt.path.split('?')[0]);
        filepath = decodeURIComponent(filepath);
        if (!fs.existsSync(filepath)) {
            res.writeHead(404, header);
            resData = '文件不存在:' + filepath;
            res.end(resData);
        }
        else{
            res.writeHead(200, header);
            resData = fs.readFileSync(filepath);
            res.end(resData);
        }
        console.log(filepath);
    }

    on() {
        this._webServer.listen(this.options.port);
        console.log(`webserver on ${this.options.port}`);
    }

    off() {
        console.log('')
    }
}

export { WebServer };