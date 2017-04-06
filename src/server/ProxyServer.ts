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
    private _server;

    public readonly options;

    constructor(options) {
        this.options = options;
        this._proxyManager = new ProxyManager(this.options.rootPath);
        console.log(this._proxyManager.getAll());
        console.log(this._proxyManager.getByUrl('http://www.17174.com'));
    }


    on() {
        console.log('proxy on');
    }

    off() {
        console.log('')
    }
}

export { ProxyServer };