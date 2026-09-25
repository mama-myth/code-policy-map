import * as vscode from 'vscode';
import { DetectedCodeContext } from '../analyzer/types';
import { PolicyLoader } from '../policies/policyLoader';

export class PolicyDiagnosticProvider {
    private diagnosticCollection: vscode.DiagnosticCollection;

    constructor() {
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection('policyToCode');
    }

    public get collection(): vscode.DiagnosticCollection {
        return this.diagnosticCollection;
    }

    public updateDiagnostics(
        document: vscode.TextDocument,
        contexts: DetectedCodeContext[],
        policyLoader: PolicyLoader
    ): void {
        this.diagnosticCollection.delete(document.uri);

        const diagnostics: vscode.Diagnostic[] = [];

        for (const ctx of contexts) {
            const policy = policyLoader.getPolicyById(ctx.matchedPolicyId);
            const title = policy ? policy.title : ctx.matchedPolicyId;

            const message = `[Policy Guidance] ${ctx.matchedPolicyId}: Potential policy consideration for sensitive pattern '${ctx.matchedSensitiveIdentifier}' in ${ctx.detectedLoggingFunction}()`;

            const diagnostic = new vscode.Diagnostic(
                ctx.range,
                message,
                vscode.DiagnosticSeverity.Warning
            );

            diagnostic.source = 'Policy-to-Code';
            diagnostic.code = ctx.matchedPolicyId;

            diagnostics.push(diagnostic);
        }

        this.diagnosticCollection.set(document.uri, diagnostics);
    }

    public clearDiagnostics(documentUri: vscode.Uri): void {
        this.diagnosticCollection.delete(documentUri);
    }

    public dispose(): void {
        this.diagnosticCollection.clear();
        this.diagnosticCollection.dispose();
    }
}
