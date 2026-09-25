import * as vscode from 'vscode';
import { PolicyLoader } from '../policies/policyLoader';

export class PolicyCodeActionProvider implements vscode.CodeActionProvider {
    public static readonly providedCodeActionKinds = [
        vscode.CodeActionKind.QuickFix
    ];

    constructor(private readonly policyLoader: PolicyLoader) {}

    public provideCodeActions(
        document: vscode.TextDocument,
        range: vscode.Range | vscode.Selection,
        context: vscode.CodeActionContext,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<(vscode.CodeAction | vscode.Command)[]> {
        const actions: vscode.CodeAction[] = [];

        for (const diagnostic of context.diagnostics) {
            if (diagnostic.source !== 'Policy-to-Code' || !diagnostic.code) {
                continue;
            }

            const policyId = diagnostic.code.toString();
            const policy = this.policyLoader.getPolicyById(policyId);

            if (policy && policy.saferExample) {
                // Action 1: Quick Fix - Apply safer code example
                const fixAction = new vscode.CodeAction(
                    `Policy-to-Code: Replace line with safer example (${policyId})`,
                    vscode.CodeActionKind.QuickFix
                );
                fixAction.diagnostics = [diagnostic];
                fixAction.isPreferred = true;

                const edit = new vscode.WorkspaceEdit();
                const lineRange = document.lineAt(diagnostic.range.start.line).range;
                edit.replace(document.uri, lineRange, policy.saferExample);
                fixAction.edit = edit;

                actions.push(fixAction);
            }

            // Action 2: View Policy Details
            const viewAction = new vscode.CodeAction(
                `Policy-to-Code: View guidance for ${policyId}`,
                vscode.CodeActionKind.Empty
            );
            viewAction.diagnostics = [diagnostic];
            viewAction.command = {
                command: 'policyToCode.showPolicyGuidance',
                title: 'Show Policy Guidance'
            };
            actions.push(viewAction);
        }

        return actions;
    }
}
