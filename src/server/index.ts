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
    private _disableGlobalProxyText = `system global proxy off`;
    private _enableGlobalProxyText: string;

    public readonly webServerPort: number;
    public readonly rootPath: string;
    public readonly proxyServerPort: number;

    constructor(options) {
        this._options = options;
        this.webServerPort = configs.webServerPort;
        this.proxyServerPort = configs.proxyServerPort;
        this.rootPath = workspace.rootPath;
        this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
        this._enableGlobalProxyText = `system global proxy to ${this.proxyServerPort}`;
        this._statusBarItem.text = `$(globe) OFF`;
        this._statusBarItem.tooltip = this._disableGlobalProxyText;
        this._statusBarItem.show();
    }

    enableGlobalProxy(port: number, fn?: Function) {
        let exec = childProcess.exec;
        let exePath = path.resolve(this._options.extensionPath, 'proxysetting.exe');
        let commandStr = `${exePath} http=127.0.0.1:${port}`;
        exec(commandStr, function (err) {
            if (!err) {
                this._statusBarItem.text = `$(globe) ON`;
                this._statusBarItem.tooltip = this._enableGlobalProxyText;
            }
            fn && fn(err);
        }.bind(this));
    }

    disableGlobalProxy(fn?: Function) {
        let exec = childProcess.exec;
        let exePath = path.resolve(this._options.extensionPath, 'proxysetting.exe');
        let commandStr = `${exePath} stop`;
        exec(commandStr, function (err) {
            if (!err) {
                this._statusBarItem.text = `$(globe) OFF`;
                this._statusBarItem.tooltip = this._disableGlobalProxyText;
            }
            fn && fn(err)
        }.bind(this));
    }

    on(fn?: Function) {
        this._webServer = new WebServer({ port: this.webServerPort, rootPath: this.rootPath });
        this._webServer.on();
        this._proxyServer = new ProxyServer({ port: this.proxyServerPort, rootPath: this.rootPath })
        this._proxyServer.on();
        fn && fn();
    }
}

export { Server }