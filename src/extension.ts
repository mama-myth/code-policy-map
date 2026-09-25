import * as vscode from 'vscode';
import { registerAnalyzeCurrentFileCommand } from './commands/analyzeCurrentFile';
import { registerShowPolicyGuidanceCommand } from './commands/showPolicyGuidance';
import { registerShowTraceabilityCommand } from './commands/showTraceability';
import { PolicyLoader } from './policies/policyLoader';
import { PolicyDiagnosticProvider } from './guidance/diagnosticProvider';
import { PolicyHoverProvider } from './guidance/hoverProvider';
import { PolicyTreeDataProvider } from './views/policyTreeDataProvider';
import { CodeContextDetector } from './analyzer/codeContextDetector';

export async function activate(context: vscode.ExtensionContext) {
    const policyLoader = new PolicyLoader(context.extensionUri);
    await policyLoader.loadPolicies();

    const diagnosticProvider = new PolicyDiagnosticProvider();
    context.subscriptions.push(diagnosticProvider);

    const hoverProvider = new PolicyHoverProvider(policyLoader);
    context.subscriptions.push(
        vscode.languages.registerHoverProvider({ language: 'python', scheme: 'file' }, hoverProvider)
    );

    const treeDataProvider = new PolicyTreeDataProvider(policyLoader);
    context.subscriptions.push(
        vscode.window.registerTreeDataProvider('policyToCode.guidanceView', treeDataProvider)
    );

    // Auto-analyze active Python document on open, save, or change
    const analyzeDocument = (document: vscode.TextDocument) => {
        if (document && document.languageId === 'python') {
            const contexts = CodeContextDetector.analyzeDocument(document, policyLoader.getPolicies());
            diagnosticProvider.updateDiagnostics(document, contexts, policyLoader);
            treeDataProvider.updateFindings(contexts);
        }
    };

    if (vscode.window.activeTextEditor) {
        analyzeDocument(vscode.window.activeTextEditor.document);
    }

    context.subscriptions.push(
        vscode.workspace.onDidOpenTextDocument((doc) => analyzeDocument(doc))
    );

    context.subscriptions.push(
        vscode.workspace.onDidSaveTextDocument((doc) => analyzeDocument(doc))
    );

    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor((editor) => {
            if (editor) {
                analyzeDocument(editor.document);
            }
        })
    );

    vscode.window.showInformationMessage('Policy-to-Code Mapper extension active with sidebar view & traceability.');

    context.subscriptions.push(registerAnalyzeCurrentFileCommand(policyLoader, diagnosticProvider, treeDataProvider));
    context.subscriptions.push(registerShowPolicyGuidanceCommand(policyLoader));
    context.subscriptions.push(registerShowTraceabilityCommand(policyLoader));
}

export function deactivate() {}
