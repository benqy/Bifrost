import * as http from 'http';
import * as url from 'url';
import * as path from 'path';
import * as fs from 'fs';
import * as childProcess from 'child_process';
import * as httpProxy from 'http-proxy';
import util from './util'
import { ProxyManager } from './ProxyManager';

class ProxyServer {
    private _proxyManager: ProxyManager;
    private _proxy;
    private _server: http.Server;

    public readonly options;

    constructor(options) {
        this.options = options;
        this._proxyManager = new ProxyManager(this.options.rootPath);
        this._proxy = httpProxy.createProxyServer();
        this._server = http.createServer(this._webHandler.bind(this));
    }

    private _webHandler(req, res) {
        const proxyItem = this._proxyManager.getByUrl(req.url);
        const urlOpt = url.parse(req.url, true);
        console.log(req.url)
        if(proxyItem){
            this._proxy.web(req,res,{
                target: 'http://127.0.0.1'
            })
        }
        else{
            this._proxy.web(req, res, {
                target: {
                    host:urlOpt.host,
                    port:urlOpt.port || 80
                },
                secure: false
            });
        }
    }

    on() {
        this._server.listen(this.options.port)
        this._proxy.on('proxyReq', function(proxyReq, req, res, options) {
            console.log(proxyReq);
            //proxyReq.setHeader('Host','www.google.co.uk');
        });
        console.log(`proxy on ${this.options.port}`);
    }

    off() {
        console.log('')
    }
}

export { ProxyServer };