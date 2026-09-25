import * as vscode from 'vscode';
import { DetectedCodeContext } from '../analyzer/types';
import { PolicyLoader } from '../policies/policyLoader';
import { TraceabilityBuilder } from '../guidance/traceabilityBuilder';
import { FeedbackStore, FeedbackAction } from '../feedback/feedbackStore';

export function registerShowTraceabilityCommand(
    policyLoader: PolicyLoader,
    feedbackStore?: FeedbackStore
): vscode.Disposable {
    return vscode.commands.registerCommand(
        'policyToCode.showTraceability',
        async (contextItem?: DetectedCodeContext) => {
            if (!contextItem) {
                vscode.window.showInformationMessage(
                    'Policy-to-Code: Select a finding from the Policy-to-Code sidebar or run "Analyze Current File".'
                );
                return;
            }

            try {
                const doc = await vscode.workspace.openTextDocument(contextItem.fileUri);
                const editor = await vscode.window.showTextDocument(doc, {
                    preserveFocus: false,
                    preview: true,
                    viewColumn: vscode.ViewColumn.One
                });

                editor.selection = new vscode.Selection(contextItem.range.start, contextItem.range.end);
                editor.revealRange(contextItem.range, vscode.TextEditorRevealType.InCenter);
            } catch (err) {
                console.error('Could not open document:', err);
            }

            const policy = policyLoader.getPolicyById(contextItem.matchedPolicyId);
            if (!policy) {
                vscode.window.showErrorMessage(`Policy ${contextItem.matchedPolicyId} not found.`);
                return;
            }

            const panel = vscode.window.createWebviewPanel(
                'policyTraceability',
                `Traceability: ${policy.id}`,
                vscode.ViewColumn.Two,
                { enableScripts: true }
            );

            panel.webview.html = TraceabilityBuilder.renderTraceabilityHtml(contextItem, policy);

            if (feedbackStore) {
                panel.webview.onDidReceiveMessage(
                    async (message) => {
                        if (message.command === 'feedback') {
                            await feedbackStore.recordFeedback(
                                message.policyId,
                                message.patternId,
                                message.action as FeedbackAction
                            );
                            vscode.window.showInformationMessage(
                                `Policy-to-Code: Recorded local feedback '${message.action}' for ${message.policyId}.`
                            );
                        }
                    },
                    undefined,
                    []
                );
            }
        }
    );
}
