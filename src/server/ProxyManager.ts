import * as path from 'path';
import * as fs from 'fs';
import util from './util'

class ProxyManager {
    private _settingPath: string;

    constructor(rootpath: string) {
        this._settingPath = rootpath + '\\bifrost.json';
    }

    private _settingExists() {
        return fs.existsSync(this._settingPath);
    }

    getByUrl(url: string) {
        var proxyItems = this.getAll();
        return proxyItems.find(n => n.url === url);
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

    getAll(): any {
        var proxyItems = [];
        if (this._settingExists()) {
            proxyItems = JSON.parse(fs.readFileSync(this._settingPath, 'utf-8'))
        }
        return proxyItems;
    }
}

export { ProxyManager }