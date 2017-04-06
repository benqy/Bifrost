import * as http from 'http';
import * as url  from 'url';
import * as path from 'path';
import * as fs from 'fs';
import * as proxy from 'http-proxy';
import util from './util'

class ProxyServer {

    constructor(options) {
    }

    on() {
        console.log('proxy on');
    }

    off() {
        console.log('')
    }
}

export { ProxyServer };