import * as vscode from 'vscode';

export function registerShowTraceabilityCommand(): vscode.Disposable {
    return vscode.commands.registerCommand('policyToCode.showTraceability', () => {
        vscode.window.showInformationMessage('Policy-to-Code: View Traceability invoked.');
    });
}
