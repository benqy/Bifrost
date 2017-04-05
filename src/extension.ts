import { window, workspace, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument } from 'vscode';
import { Proxy,WebServer } from './server';


export function activate(context: ExtensionContext) {
    console.log('Congratulations, your extension "Bifrost" is now active!');

    var server = new WebServer({ port: 80,rootPath:workspace.rootPath });
    server.on();
}