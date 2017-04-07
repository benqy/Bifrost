import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';
import util from './util'

interface ProxyItem {
    url
    filepath
    disable
    runWithNode
}


class ProxyManager {
    private _settingPath: string;

    constructor(rootpath: string) {
        this._settingPath = rootpath + '\\bifrost.json';
    }

    private _settingExists() {
        return fs.existsSync(this._settingPath);
    }

    getByIndex(index: number) {
        const proxyItems = this.getAll();
        return proxyItems[index];
    }

    getByUrl(urlStr: string) {
        const proxyItems = this.getAll();
        const urlStrOpt = url.parse(urlStr.toLowerCase(), true);
        let index;
        let proxyItem = proxyItems.find((n, i) => {
            const proxyUrlOpt = url.parse(n.url.toLowerCase(), true);
            // console.log(n.url,proxyUrlOpt);
            // console.log(urlStr,urlStrOpt);
            if (urlStrOpt.host === proxyUrlOpt.host && urlStrOpt.port === proxyUrlOpt.port && urlStrOpt.pathname === proxyUrlOpt.pathname) {
                index = i;
                return true;
            };
            //n.url.toLowerCase() === urlStr.toLowerCase()
        })
        return {
            proxyItem,
            index
        };
    }

    getByFilePath(filepath: string) {
        var proxyItems = this.getAll();
        return proxyItems.find(n => n.filepath === filepath);
    }

    save(proxyItem) {
        var proxyItems = this.getAll();
        console.log('save: ' + JSON.stringify(proxyItems, (key, value) => {
            return value;
        }, 4));
    }

    getAll(): Array<ProxyItem> {
        var proxyItems = [];
        if (this._settingExists()) {
            proxyItems = JSON.parse(fs.readFileSync(this._settingPath, 'utf-8'))
        }
        return proxyItems;
    }
}

export { ProxyManager, ProxyItem }