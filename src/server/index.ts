import { ProxyServer } from './ProxyServer';
import { WebServer } from './WebServer';
import * as path from 'path';
import * as childProcess from 'child_process';
import { window, workspace, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument } from 'vscode';
const configs = workspace.getConfiguration('bifrost');

class Server {
    private _webServer: WebServer;
    private _proxyServer: ProxyServer;
    private _statusBarItem: StatusBarItem;
    private _globalProxyOn = false;

    public readonly webServerPort: number;
    public readonly rootPath: string;
    public readonly proxyServerPort: number;

    constructor(readonly options) {
        this.webServerPort = configs.webServerPort;
        this.proxyServerPort = configs.proxyServerPort;
        this.rootPath = workspace.rootPath;
        this._initStatusBar();
    }

    private _initStatusBar() {
        this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
        this._statusBarItem.command = 'extension.bf.toggle_global_proxy';
        this._displayOffStatus();
        this._statusBarItem.show();
    }

    private _displayOnStatus() {
        this._globalProxyOn = true;
        this._statusBarItem.text = `$(globe) ON`;
        this._statusBarItem.color = '#00ff00';
        this._statusBarItem.tooltip = `system global proxy to ${this.proxyServerPort}`;
    }

    private _displayOffStatus() {
        this._globalProxyOn = false;
        this._statusBarItem.text = `$(globe) OFF`;
        this._statusBarItem.color = '#ccc';
        this._statusBarItem.tooltip = 'system global proxy off';
    }

    toggleGlobalProxy() {
        this._globalProxyOn ? this.disableGlobalProxy() : this.enableGlobalProxy();
    }

    enableGlobalProxy() {
        let exec = childProcess.exec;
        let exePath = path.resolve(this.options.extensionPath, 'proxysetting.exe');
        let commandStr = `${exePath} http=127.0.0.1:${this.proxyServerPort}`;
        exec(commandStr, err => !err && this._displayOnStatus());
    }

    disableGlobalProxy() {
        let exec = childProcess.exec;
        let exePath = path.resolve(this.options.extensionPath, 'proxysetting.exe');
        let commandStr = `${exePath} stop`;
        exec(commandStr, err => !err && this._displayOffStatus());
    }

    on(fn?: Function) {
        this._webServer = new WebServer({ port: this.webServerPort, rootPath: this.rootPath });
        this._webServer.on();
        this._proxyServer = new ProxyServer({ port: this.proxyServerPort,webServerport: this.webServerPort, rootPath: this.rootPath })
        this._proxyServer.on();
        fn && fn();
    }
}

export { Server }