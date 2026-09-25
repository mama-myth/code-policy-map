import * as vscode from 'vscode';

export function registerAnalyzeCurrentFileCommand(): vscode.Disposable {
    return vscode.commands.registerCommand('policyToCode.analyzeCurrentFile', () => {
        vscode.window.showInformationMessage('Policy-to-Code: Analyze Current File invoked.');
    });
}
