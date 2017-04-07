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
        let {proxyItem,index} = this._proxyManager.getByUrl(req.url);
        const urlOpt = url.parse(req.url, true);
        if (proxyItem && !proxyItem.disable) {
            console.log(proxyItem)
            req.url = `http://127.0.0.1${this.options.webServerport}?isProxyRequest=true&proxyItemIndex=${index}&oriurl=${encodeURIComponent(req.url)}`;
            this._proxy.web(req, res, {
                target: {
                    host: '127.0.0.1',
                    port: this.options.webServerport
                }
            }, err => console.log('err'))
        }
        else {
            console.log(urlOpt,urlOpt.port || 80)
            this._proxy.web(req, res, {
                target: {
                    host: urlOpt.hostname,
                    port: urlOpt.port || 80
                },
                secure: false
            }, err => console.log('err reve'));
        }
    }

    on() {
        this._server.listen(this.options.port)
        // this._proxy.on('proxyReq', function(proxyReq, req, res, options) {
        //     console.log(proxyReq);
        //     //proxyReq.setHeader('Host','www.google.co.uk');
        // });
        // this._server.on('error', function (err, req, res) {
        //     res.writeHead(500, {
        //         'Content-Type': 'text/plain'
        //     });

        //     res.end('Something went wrong. And we are reporting a custom error message.');
        // });
        console.log(`proxy on ${this.options.port}`);
    }

    off() {
        console.log('')
    }
}

export { ProxyServer };