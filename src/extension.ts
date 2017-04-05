import { window, workspace, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument } from 'vscode';
import { Proxy,WebServer } from './server';

export function activate(context: ExtensionContext) {
    console.log('Congratulations, your extension "Bifrost" is now active!');

    var server = new WebServer({ port: 80,rootPath:workspace.rootPath });
    server.on();
    commands.registerCommand('extension.bf.open_in_browser', (events) => {
        let filepath = events.fsPath.replace(workspace.rootPath, '').replace(/\\/ig,'/');
        let url = 'http://10.5.15.99' + (server.options.port == 80 ? '' : ':' + server.options.port) + filepath;
        console.log(`open:${url}`);
    });
}