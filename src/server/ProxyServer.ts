import * as http from 'http';
import * as url from 'url';
import * as path from 'path';
import * as fs from 'fs';
import * as proxy from 'http-proxy';
import util from './util'
import { ProxyManager } from './ProxyManager';

class ProxyServer {
    private _proxyManager: ProxyManager;
    public readonly options = {
        port: 10086,
        rootPath: '/'
    };
    constructor(options) {
        this.options = options;
        this._proxyManager = new ProxyManager(this.options.rootPath);
        console.log(this._proxyManager.getAll());
    }

    on() {
        this._proxyManager.getAll();
        console.log('proxy on');
    }

    off() {
        console.log('')
    }
}

export { ProxyServer };