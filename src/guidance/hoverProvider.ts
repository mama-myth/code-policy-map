import * as vscode from 'vscode';
import { PolicyLoader } from '../policies/policyLoader';
import { CodeContextDetector } from '../analyzer/codeContextDetector';
import { GuidanceBuilder } from './guidanceBuilder';

export class PolicyHoverProvider implements vscode.HoverProvider {
    constructor(private readonly policyLoader: PolicyLoader) {}

    public async provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): Promise<vscode.Hover | null> {
        if (document.languageId !== 'python' && !document.fileName.endsWith('.py')) {
            return null;
        }

        let policies = this.policyLoader.getPolicies();
        if (policies.length === 0) {
            policies = await this.policyLoader.loadPolicies();
        }

        if (policies.length === 0) {
            return null;
        }

        const contexts = CodeContextDetector.analyzeDocument(document, policies);

        for (const ctx of contexts) {
            if (ctx.lineNumber === position.line) {
                const policy = this.policyLoader.getPolicyById(ctx.matchedPolicyId);
                if (policy) {
                    const markdown = GuidanceBuilder.buildHoverMarkdown(ctx, policy);
                    return new vscode.Hover(markdown, ctx.range);
                }
            }
        }

        return null;
    }
}
