import * as vscode from 'vscode';
import { registerAnalyzeCurrentFileCommand } from './commands/analyzeCurrentFile';
import { registerShowPolicyGuidanceCommand } from './commands/showPolicyGuidance';
import { registerShowTraceabilityCommand } from './commands/showTraceability';
import { registerShowFeedbackSummaryCommand } from './commands/showFeedbackSummary';
import { PolicyLoader } from './policies/policyLoader';
import { PolicyDiagnosticProvider } from './guidance/diagnosticProvider';
import { PolicyHoverProvider } from './guidance/hoverProvider';
import { PolicyCodeActionProvider } from './guidance/codeActionProvider';
import { PolicyTreeDataProvider } from './views/policyTreeDataProvider';
import { FeedbackStore } from './feedback/feedbackStore';
import { CodeContextDetector } from './analyzer/codeContextDetector';

export async function activate(context: vscode.ExtensionContext) {
    const policyLoader = new PolicyLoader(context.extensionUri);
    await policyLoader.loadPolicies();

    const feedbackStore = new FeedbackStore(context.globalState);

    const diagnosticProvider = new PolicyDiagnosticProvider();
    context.subscriptions.push(diagnosticProvider);

    const hoverProvider = new PolicyHoverProvider(policyLoader);
    context.subscriptions.push(
        vscode.languages.registerHoverProvider({ language: 'python', scheme: 'file' }, hoverProvider)
    );

    const codeActionProvider = new PolicyCodeActionProvider(policyLoader);
    context.subscriptions.push(
        vscode.languages.registerCodeActionsProvider(
            { language: 'python', scheme: 'file' },
            codeActionProvider,
            { providedCodeActionKinds: PolicyCodeActionProvider.providedCodeActionKinds }
        )
    );

    const treeDataProvider = new PolicyTreeDataProvider(policyLoader);
    context.subscriptions.push(
        vscode.window.registerTreeDataProvider('policyToCode.guidanceView', treeDataProvider)
    );

    // Auto-analyze Python document on open, save, active tab change, or live edit
    const analyzeDocument = (document: vscode.TextDocument) => {
        if (document && (document.languageId === 'python' || document.fileName.endsWith('.py'))) {
            const rawContexts = CodeContextDetector.analyzeDocument(document, policyLoader.getPolicies());
            // Filter out findings dismissed by the user locally
            const activeContexts = rawContexts.filter(
                (ctx) => !feedbackStore.isPatternDismissed(ctx.patternId)
            );

            diagnosticProvider.updateDiagnostics(document, activeContexts, policyLoader);
            treeDataProvider.updateFindings(activeContexts);
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
        vscode.workspace.onDidChangeTextDocument((e) => analyzeDocument(e.document))
    );

    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor((editor) => {
            if (editor) {
                analyzeDocument(editor.document);
            }
        })
    );

    vscode.window.showInformationMessage('Policy-to-Code Mapper extension active.');

    context.subscriptions.push(registerAnalyzeCurrentFileCommand(policyLoader, diagnosticProvider, treeDataProvider));
    context.subscriptions.push(registerShowPolicyGuidanceCommand(policyLoader));
    context.subscriptions.push(registerShowTraceabilityCommand(policyLoader, feedbackStore));
    context.subscriptions.push(registerShowFeedbackSummaryCommand(feedbackStore));
}

export function deactivate() {}
