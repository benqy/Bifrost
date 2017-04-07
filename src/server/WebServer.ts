import * as http from 'http';
import * as url from 'url';
import * as path from 'path';
import * as fs from 'fs';
import util from './util'
import { ProxyManager,ProxyItem } from './ProxyManager';

class WebServer {
    private _server:http.Server;
    private _proxyManager: ProxyManager;
    public readonly options;

    constructor(options) {
        this.options = options;
        this._proxyManager = new ProxyManager(this.options.rootPath);
        this._server = http.createServer(this._webHandler.bind(this));
    }

    private _readFile(filepath){
        return fs.readFileSync(filepath);
    }

    private _404(filepath){
        return `文件不存在 : ${filepath}`;
    }

    private _webHandler(req, res) {
        let urlOpt = url.parse(req.url, true);
        console.log(urlOpt)
        if(urlOpt.query.isProxyRequest){
            let proxyItem = this._proxyManager.getByIndex(urlOpt.query.proxyItemIndex*1);
            console.log(proxyItem);
            this._proxyHandler(urlOpt,req,res,proxyItem);
        }
        else{
            this._staticFileHandler(urlOpt, req, res);
        }
    }

    private _proxyHandler(urlOpt,req,res,proxyItem:ProxyItem){
        console.log('_proxyHandler')
        let resData;        
        let header = {'content-type': util.getContentType(url.parse(urlOpt.query.oriurl, true).pathname)};
        console.log(header);
        if(fs.existsSync(proxyItem.filepath)){
            resData = this._readFile(proxyItem.filepath);
            res.writeHead(200, header);
        }
        else{
            resData = this._404(proxyItem.filepath);
            res.writeHead(404, header);
        }
        res.end(resData);
    }

    private _staticFileHandler(urlOpt, req, res) {
        let resData;
        let header = { 'content-type': util.getContentType(urlOpt.pathname) };
        let filepath = path.resolve(this.options.rootPath + urlOpt.path.split('?')[0]);
        filepath = decodeURIComponent(filepath);
        if (!fs.existsSync(filepath)) {
            res.writeHead(404, header);
            resData = this._404(filepath);
        }
        else if (fs.statSync(filepath).isDirectory()) {
            resData = this._renderDir(urlOpt, filepath);
            res.writeHead(200, header);
        }
        else {
            res.writeHead(200, header);
            resData = this._readFile(filepath);
        }
        res.end(resData);
    }

    /**
     * 列出目录
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
        //console.log(`webserver on ${this.options.port}`);
    }

    off() {
        console.log('off')
    }
}

export { WebServer };