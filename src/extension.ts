import { window, workspace, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument } from 'vscode';
import { Proxy,WebServer } from './server';
import * as broswerOpener from 'open';
let ip = require('ip').address();

export function activate(context: ExtensionContext) {
    console.log('Congratulations, your extension "Bifrost" is now active!');

    
    let defaultOptions = workspace.getConfiguration('bifrost');
    var server = new WebServer({ port: defaultOptions.port,rootPath:workspace.rootPath });
    server.on();
    
    commands.registerCommand('extension.bf.open_in_browser', (events) => {
        let fsPath;
        // window.showInputBox({prompt: 'What is your favorite fruit?'})
        //     .then(val => window.showInformationMessage('Your input was ' + val));
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