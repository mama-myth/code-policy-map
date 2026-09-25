import * as vscode from 'vscode';

export function registerShowPolicyGuidanceCommand(): vscode.Disposable {
    return vscode.commands.registerCommand('policyToCode.showPolicyGuidance', () => {
        vscode.window.showInformationMessage('Policy-to-Code: Show Policy Guidance invoked.');
    });
}
