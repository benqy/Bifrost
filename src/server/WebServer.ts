import * as http from 'http';
import * as url from 'url';
import * as path from 'path';
import * as fs from 'fs';
import util from './util'
import { ProxyManager, ProxyItem } from './ProxyManager';

class WebServer {
    private _server: http.Server;
    private _proxyManager: ProxyManager;

    constructor(readonly options) {
        this._proxyManager = new ProxyManager(this.options.rootPath);
        this._server = http.createServer(this._webHandler.bind(this));
    }

    private _readFile(filepath) {
        return fs.readFileSync(filepath);
    }

    private _404(filepath) {
        return `文件不存在 : ${filepath}`;
    }

    private _webHandler(req, res) {
        let urlOpt = url.parse(req.url, true);
        //console.log(urlOpt)
        if (urlOpt.query.isProxyRequest) {
            let proxyItem = this._proxyManager.getByIndex(urlOpt.query.proxyItemIndex * 1);
            console.log(proxyItem);
            this._proxyHandler(urlOpt, req, res, proxyItem);
        }
        else {
            this._staticFileHandler(urlOpt, req, res);
        }
    }

    private _proxyHandler(urlOpt, req, res, proxyItem: ProxyItem) {
        console.log('_proxyHandler')
        let resData;
        let oriUrlOpt = url.parse(urlOpt.query.oriurl, true);
        let header = { 'content-type': util.getContentType(oriUrlOpt.pathname) };
        console.log(1, proxyItem);
        if (!fs.existsSync(proxyItem.filepath)) {
            resData = this._404(proxyItem.filepath);
            res.writeHead(404, header);
        }
        //浏览器请求的url所属的host被整个代理到本地目录,因此该host下的路径都指向代理目录
        else if (util.isdir(proxyItem.filepath)) {
            console.log('dir')
            console.log(oriUrlOpt)
            let relativePath = decodeURIComponent(urlOpt.query.oriurl).toLowerCase().replace(proxyItem.url, '');
            let filepath = path.join(proxyItem.filepath, relativePath);
            let { statusCode, resData} = this._readResponseContent(filepath,oriUrlOpt);
            res.writeHead(statusCode, header);
            res.end(resData);
        }
        else {
            let fileText = this._readFile(proxyItem.filepath);
            if (proxyItem.runWithNode) {
                try {
                    let customFn = new Function('query', fileText.toString());
                    resData = customFn(oriUrlOpt.query).toString();
                } catch (e) {
                    resData = JSON.stringify(e.message);
                }
            }
            else {
                resData = fileText;
            }
            res.writeHead(200, header);
        }
        res.end(resData);
    }

    private _readResponseContent(filepath, urlOpt) {
        let statusCode = 200;
        let resData;
        if (!fs.existsSync(filepath)) {
            statusCode = 404;
            resData = this._404(filepath);
        }
        else if (util.isdir(filepath)) {
            resData = this._renderDir(urlOpt, filepath);
        }
        else {
            resData = this._readFile(filepath);
        }
        return { statusCode, resData };
    }

    private _staticFileHandler(urlOpt, req, res) {
        let header = { 'content-type': util.getContentType(urlOpt.pathname) };
        let filepath = path.resolve(this.options.rootPath + urlOpt.path.split('?')[0]);
        filepath = decodeURIComponent(filepath);
        let { statusCode, resData } = this._readResponseContent(filepath, urlOpt);
        res.writeHead(statusCode, header);
        res.end(resData);
    }

    /**
     * 读取目录列表
     */
    private _renderDir(urlOpt, dir) {
        if (!fs.existsSync(dir)) return '';
        var files = fs.readdirSync(dir), resData = '<h3>' + dir + '</h3>', href = '';
        files.forEach(file => {
            href = (urlOpt.href + '/' + file).replace(/((\:?)\/{1,})/g, ($m, $1, $2) => { return $2 ? $1 : '/'; });
            resData += '<a href="' + href + '">' + file + '</a></br>';
        });
        return resData;
    }

    on() {
        this._server.listen(this.options.port);
        this._server.timeout = 10000;
        //console.log(`webserver on ${this.options.port}`);
    }

    off() {
        console.log('off')
    }
}

export { WebServer };