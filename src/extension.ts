import * as vscode from 'vscode';
import { registerAnalyzeCurrentFileCommand } from './commands/analyzeCurrentFile';
import { registerShowPolicyGuidanceCommand } from './commands/showPolicyGuidance';
import { registerShowTraceabilityCommand } from './commands/showTraceability';

export function activate(context: vscode.ExtensionContext) {
    vscode.window.showInformationMessage('Policy-to-Code Mapper extension is now active.');

    context.subscriptions.push(registerAnalyzeCurrentFileCommand());
    context.subscriptions.push(registerShowPolicyGuidanceCommand());
    context.subscriptions.push(registerShowTraceabilityCommand());
}

export function deactivate() {}
