import { ProxyServer } from './ProxyServer';
import { WebServer } from './WebServer';
import * as path from 'path';
import * as childProcess from 'child_process';
import { window, workspace, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument } from 'vscode';
const configs = workspace.getConfiguration('bifrost');

class Server {
    private _options;
    private _webServer: WebServer;
    private _proxyServer: ProxyServer;
    private _statusBarItem: StatusBarItem;
    private _proxyOffText = 'proxy server off';
    private _proxyOnText:string;

    public readonly webServerPort: number;
    public readonly rootPath: string;
    public readonly proxyServerPort: number;

    constructor(options) {
        this._options = options;
        this.webServerPort = configs.webServerPort;
        this.proxyServerPort = configs.proxyServerPort;
        this.rootPath = workspace.rootPath;
        this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
        this._proxyOnText  = `proxy server on ${this.proxyServerPort}`;
        this._statusBarItem.text = this._proxyOffText;
        this._statusBarItem.show();
    }

    setProxy(port: number, fn?: Function) {
        let exec = childProcess.exec;
        let exePath = path.resolve(this._options.extensionPath, 'proxysetting.exe');
        let commandStr = `${exePath} http=127.0.0.1:${port}`;
        exec(commandStr, function (err) {
            if(err){
                this._statusBarItem.text = this._proxyOffText;
            }
            else{
                this._statusBarItem.text = this._proxyOnText;
            }
            fn && fn(err);
        }.bind(this));
    }

    disProxy(fn?: Function) {
        let exec = childProcess.exec;
        let exePath = path.resolve(this._options.extensionPath, 'proxysetting.exe');
        let commandStr = `${exePath} stop`;
        exec(commandStr, function (err) {
            fn && fn(err)
        });
    }

    on(fn?: Function) {
        this._webServer = new WebServer({ port: this.webServerPort, rootPath: this.rootPath });
        this._webServer.on();
        this._proxyServer = new ProxyServer({ port: this.proxyServerPort, rootPath: this.rootPath })
        this._proxyServer.on();
        this.setProxy(this.proxyServerPort, err => {
            if (!err) {
                console.log(`set global proxy on ${this.proxyServerPort}`)
            }
        });
        fn && fn();
    }
}

export { Server }