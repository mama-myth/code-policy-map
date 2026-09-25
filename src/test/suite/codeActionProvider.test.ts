import * as assert from 'assert';
import * as vscode from 'vscode';
import { PolicyCodeActionProvider } from '../../guidance/codeActionProvider';
import { PolicyLoader } from '../../policies/policyLoader';

suite('Code Action Provider Test Suite', () => {
    test('Provides QuickFix code actions for Policy-to-Code diagnostics', async () => {
        const loader = new PolicyLoader();
        await loader.loadPolicies();

        const provider = new PolicyCodeActionProvider(loader);

        const diagnostic = new vscode.Diagnostic(
            new vscode.Range(0, 0, 0, 15),
            '[Policy Guidance] SEC-LOG-001: Potential policy consideration',
            vscode.DiagnosticSeverity.Warning
        );
        diagnostic.source = 'Policy-to-Code';
        diagnostic.code = 'SEC-LOG-001';

        const dummyDoc = {
            uri: vscode.Uri.file('/test/app.py'),
            lineAt: () => ({ range: new vscode.Range(0, 0, 0, 15) })
        } as unknown as vscode.TextDocument;

        const context: vscode.CodeActionContext = {
            diagnostics: [diagnostic],
            only: undefined,
            triggerKind: vscode.CodeActionTriggerKind.Invoke
        };

        const actions = provider.provideCodeActions(
            dummyDoc,
            new vscode.Range(0, 0, 0, 15),
            context,
            new vscode.CancellationTokenSource().token
        ) as vscode.CodeAction[];

        assert.ok(actions.length >= 1);
        assert.ok(actions[0].title.includes('Replace line with safer example'));
        assert.strictEqual(actions[0].kind, vscode.CodeActionKind.QuickFix);
    });
});
