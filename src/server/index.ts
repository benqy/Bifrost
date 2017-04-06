import { ProxyServer } from './ProxyServer';
import { WebServer } from './WebServer';
import { window, workspace, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument } from 'vscode';
const defaultOptions = workspace.getConfiguration('bifrost');

class Server {
    private _webServer: WebServer;
    private _proxyServer: ProxyServer;

    public readonly webServerPort:number;
    public readonly rootPath:string;

    constructor() {
        this.webServerPort = defaultOptions.webServerPort;
        this.rootPath = workspace.rootPath;
    }

    on(fn?:Function) {
        this._webServer = new WebServer({ port: this.webServerPort, rootPath: this.rootPath });
        this._webServer.on();
        fn();
    }
}

export { Server }