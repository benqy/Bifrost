import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';
import util from './util'

interface ProxyItem {
    /**
     * 要代理的线上地址
     */
    url
    /**
     * 本地文件
     */
    filepath
    /**
     * 禁用
     */
    disable
    /**
     * 将本地文件内容作为function(query){}的方法内容在node环境下运行,并返回结果.
     * 一般用于模拟动态接口
     */
    runWithNode
}


class ProxyManager {

    //单例
    static _current: ProxyManager;
    get proxyItems(): Array<ProxyItem> {
        return this._proxyItems;
    }

    private _proxyItems: Array<ProxyItem> = [];

    constructor(private _settingPath: string) {
        this._settingPath += '\\bifrost.json';
        if (ProxyManager._current) {
            return ProxyManager._current;
        }
        else {
            console.log('static init Proxy Manager')
            fs.watch(this._settingPath, (eventType, filename) => {
                console.log('update bifrost.json');
                this._readProxyItemsFile();
            });
            this._readProxyItemsFile();
            ProxyManager._current = this;
        }
    }

    private _settingExists() {
        return fs.existsSync(this._settingPath);
    }

    getByIndex(index: number) {
        return this.proxyItems[index];
    }

    getByUrl(urlStr: string) {
        const urlStrOpt = url.parse(urlStr.toLowerCase(), true);
        let index;
        let proxyItem = this.proxyItems.find((n, i) => {
            const proxyUrlOpt = url.parse(n.url.toLowerCase(), true);
            if (urlStrOpt.host === proxyUrlOpt.host
                && urlStrOpt.port === proxyUrlOpt.port) {
                if (urlStrOpt.pathname === proxyUrlOpt.pathname) {
                    index = i;
                    return true;
                }
                //设置了整个目录代理(n.filepath),请求的文件在这个目录中,则该文件也被代理到对应的相对路径.
                else if (util.isdir(n.filepath) && ~urlStrOpt.pathname.trim().indexOf(proxyUrlOpt.pathname.trim())) {
                    index = i;
                    return true;
                }
            };
            //n.url.toLowerCase() === urlStr.toLowerCase()
        })
        return {
            proxyItem,
            index
        };
    }



    getByFilePath(filepath: string) {
        return this.proxyItems.find(n => n.filepath === filepath);
    }

    save(proxyItems) {
        let jsonStr = JSON.stringify(proxyItems, (key, value) => {
            return value;
        }, 4);
        fs.writeFileSync(this._settingPath, jsonStr);
    }

    private _readProxyItemsFile() {
        if (this._settingExists()) {
            let fileContent = fs.readFileSync(this._settingPath, 'utf-8');
            this._proxyItems = fileContent ? JSON.parse(fs.readFileSync(this._settingPath, 'utf-8')) : [];
        }
        else {
            console.log('create bifrost.json');
            this._proxyItems = [{
                url: 'http://www.proxyitems.com',
                filepath: this._settingPath,
                disable: false,
                runWithNode: false
            }];
            this.save(this._proxyItems);
        }
    }


}



export { ProxyManager, ProxyItem }