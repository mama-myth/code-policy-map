import * as vscode from 'vscode';
import { registerAnalyzeCurrentFileCommand } from './commands/analyzeCurrentFile';
import { registerShowPolicyGuidanceCommand } from './commands/showPolicyGuidance';
import { registerShowTraceabilityCommand } from './commands/showTraceability';
import { PolicyLoader } from './policies/policyLoader';

export async function activate(context: vscode.ExtensionContext) {
    const policyLoader = new PolicyLoader(context.extensionUri);
    await policyLoader.loadPolicies();

    vscode.window.showInformationMessage('Policy-to-Code Mapper extension active with loaded policies.');

    context.subscriptions.push(registerAnalyzeCurrentFileCommand());
    context.subscriptions.push(registerShowPolicyGuidanceCommand(policyLoader));
    context.subscriptions.push(registerShowTraceabilityCommand());
}

export function deactivate() {}
