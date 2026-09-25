import * as vscode from 'vscode';
import { PolicyLoader } from '../policies/policyLoader';
import { CodeContextDetector } from '../analyzer/codeContextDetector';
import { PolicyDiagnosticProvider } from '../guidance/diagnosticProvider';

let outputChannel: vscode.OutputChannel | undefined;

function getOutputChannel(): vscode.OutputChannel {
    if (!outputChannel) {
        outputChannel = vscode.window.createOutputChannel('Policy-to-Code Mapper');
    }
    return outputChannel;
}

export function registerAnalyzeCurrentFileCommand(
    policyLoader: PolicyLoader,
    diagnosticProvider?: PolicyDiagnosticProvider
): vscode.Disposable {
    return vscode.commands.registerCommand('policyToCode.analyzeCurrentFile', async () => {
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            vscode.window.showInformationMessage('Policy-to-Code: No active text editor open.');
            return;
        }

        const document = editor.document;

        if (document.languageId !== 'python') {
            vscode.window.showWarningMessage(
                `Policy-to-Code: Unsupported language '${document.languageId}'. Currently, Python (.py) is supported.`
            );
            return;
        }

        const policies = policyLoader.getPolicies().length > 0
            ? policyLoader.getPolicies()
            : await policyLoader.loadPolicies();

        const detectedContexts = CodeContextDetector.analyzeDocument(document, policies);

        if (diagnosticProvider) {
            diagnosticProvider.updateDiagnostics(document, detectedContexts, policyLoader);
        }

        const channel = getOutputChannel();
        channel.clear();
        channel.appendLine(`================================================================`);
        channel.appendLine(`Policy-to-Code Mapper Analysis Report`);
        channel.appendLine(`File: ${document.fileName}`);
        channel.appendLine(`Time: ${new Date().toISOString()}`);
        channel.appendLine(`================================================================\n`);

        if (detectedContexts.length === 0) {
            channel.appendLine('No policy considerations detected in this file.');
            channel.show(true);
            vscode.window.showInformationMessage('Policy-to-Code: No policy considerations detected in current file.');
            return;
        }

        channel.appendLine(`Detected ${detectedContexts.length} potential policy consideration(s):\n`);

        detectedContexts.forEach((ctx, index) => {
            channel.appendLine(`[Finding #${index + 1}]`);
            channel.appendLine(`  Matched Policy ID: ${ctx.matchedPolicyId}`);
            channel.appendLine(`  Severity: ${ctx.severity.toUpperCase()}`);
            channel.appendLine(`  Line #${ctx.lineNumber + 1}: ${ctx.lineText}`);
            channel.appendLine(`  Logging Function: ${ctx.detectedLoggingFunction}`);
            channel.appendLine(`  Sensitive Identifier: ${ctx.matchedSensitiveIdentifier}`);
            channel.appendLine(`  Pattern ID: ${ctx.patternId}`);
            channel.appendLine(`----------------------------------------------------------------`);
        });

        channel.show(true);
        vscode.window.showWarningMessage(
            `Policy-to-Code: Found ${detectedContexts.length} potential policy consideration(s) in current file. See Output channel and editor diagnostics.`
        );
    });
}
