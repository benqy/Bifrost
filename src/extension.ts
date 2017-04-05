import { window, workspace, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument } from 'vscode';
import { Proxy,WebServer } from './server';
let broswerOpener = require('open');
let ip = require('ip').address();

export function activate(context: ExtensionContext) {
    console.log('Congratulations, your extension "Bifrost" is now active!');

    var server = new WebServer({ port: 80,rootPath:workspace.rootPath });
    server.on();
    
    commands.registerCommand('extension.bf.open_in_browser', (events) => {
        let fsPath;
        if(events.fsPath){
            fsPath = events.fsPath;
        }
        else if(window.activeTextEditor){
            fsPath = window.activeTextEditor.document.fileName;
        }
        let filepath = fsPath.replace(workspace.rootPath, '').replace(/\\/ig,'/');
        let url = 'http:' + ip + (server.options.port == 80 ? '' : ':' + server.options.port) + filepath;
        broswerOpener(url);
        console.log(`open:${url}`);
    });
}