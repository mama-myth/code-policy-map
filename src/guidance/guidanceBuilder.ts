import * as vscode from 'vscode';
import { DetectedCodeContext } from '../analyzer/types';
import { PolicyRecord, ADVISORY_DISCLAIMER } from '../policies/policyTypes';

export class GuidanceBuilder {
    public static buildHoverMarkdown(
        ctx: DetectedCodeContext,
        policy: PolicyRecord
    ): vscode.MarkdownString {
        const md = new vscode.MarkdownString();
        md.isTrusted = true;

        md.appendMarkdown(`### 🛡️ Policy-to-Code Guidance\n\n`);
        md.appendMarkdown(`**Potential policy consideration:**\n`);
        md.appendMarkdown(`This logging statement contains sensitive pattern \`${ctx.matchedSensitiveIdentifier}\` passed to \`${ctx.detectedLoggingFunction}()\`.\n\n`);

        md.appendMarkdown(`**Relevant organizational policy:**\n`);
        md.appendMarkdown(`**${policy.id}** — *${policy.title}*\n\n`);

        md.appendMarkdown(`**Code evidence:**\n`);
        md.appendCodeblock(ctx.lineText, 'python');

        md.appendMarkdown(`**Why this matters:**\n`);
        md.appendMarkdown(`${policy.riskExplanation}\n\n`);

        if (policy.supportingRegulatoryContext && policy.supportingRegulatoryContext.length > 0) {
            md.appendMarkdown(`**Supporting regulatory context:**\n`);
            for (const reg of policy.supportingRegulatoryContext) {
                md.appendMarkdown(`- **${reg.framework} ${reg.article}** (${reg.title}): *${reg.relationship}*\n`);
            }
            md.appendMarkdown(`\n`);
        }

        md.appendMarkdown(`**Suggested developer action:**\n`);
        md.appendMarkdown(`${policy.suggestedAction}\n\n`);

        md.appendMarkdown(`**Safer implementation example:**\n`);
        md.appendCodeblock(policy.saferExample, 'python');

        md.appendMarkdown(`**Traceability:**\n`);
        md.appendMarkdown(`\`Code\` → \`${ctx.detectedLoggingFunction}(${ctx.matchedSensitiveIdentifier})\` → **${policy.id}** → **${policy.supportingRegulatoryContext[0]?.framework || 'Policy'}** → \`Safer Example\`\n\n`);

        md.appendMarkdown(`---\n`);
        md.appendMarkdown(`*Disclaimer: ${ADVISORY_DISCLAIMER}*\n`);

        return md;
    }
}
