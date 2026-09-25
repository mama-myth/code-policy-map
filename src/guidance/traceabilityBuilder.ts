import { DetectedCodeContext } from '../analyzer/types';
import { PolicyRecord, ADVISORY_DISCLAIMER } from '../policies/policyTypes';

export interface TraceabilityChain {
    sourceCodeLine: string;
    detectedPattern: string;
    policyRequirement: string;
    supportingRegulatoryContext: string[];
    suggestedAction: string;
    saferExample: string;
}

export class TraceabilityBuilder {
    public static buildChain(
        ctx: DetectedCodeContext,
        policy: PolicyRecord
    ): TraceabilityChain {
        const regStrings = policy.supportingRegulatoryContext.map(
            (reg) => `${reg.framework} ${reg.article}: ${reg.title}`
        );

        return {
            sourceCodeLine: ctx.lineText,
            detectedPattern: `Function '${ctx.detectedLoggingFunction}' logging sensitive identifier '${ctx.matchedSensitiveIdentifier}'`,
            policyRequirement: `${policy.id}: ${policy.title} — ${policy.description}`,
            supportingRegulatoryContext: regStrings,
            suggestedAction: policy.suggestedAction,
            saferExample: policy.saferExample
        };
    }

    public static renderTraceabilityHtml(
        ctx: DetectedCodeContext,
        policy: PolicyRecord
    ): string {
        const chain = this.buildChain(ctx, policy);

        const regHtml = chain.supportingRegulatoryContext
            .map((item) => `<div class="step-card reg-step">⚖️ <strong>Supporting Regulatory Context:</strong> ${item}</div>`)
            .join('');

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Policy Traceability — ${policy.id}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 1.5rem; line-height: 1.6; color: var(--vscode-editor-foreground); background-color: var(--vscode-editor-background); }
        h1, h2 { color: var(--vscode-symbolIcon-keywordForeground, #007acc); }
        .trace-container { display: flex; flex-direction: column; gap: 12px; margin-top: 1rem; }
        .step-card { border: 1px solid var(--vscode-widget-border, #444); border-left: 5px solid #007acc; padding: 12px 16px; border-radius: 4px; background: var(--vscode-editor-inactiveSelectionBackground, #252526); }
        .code-step { border-left-color: #f0ad4e; }
        .policy-step { border-left-color: #5cb85c; }
        .reg-step { border-left-color: #5bc0de; }
        .action-step { border-left-color: #d9534f; }
        .code-block { background: var(--vscode-textCodeBlock-background, #1e1e1e); padding: 8px 12px; border-radius: 4px; font-family: monospace; font-size: 0.95em; white-space: pre-wrap; margin-top: 6px; }
        .arrow { text-align: center; font-size: 1.2rem; color: var(--vscode-descriptionForeground); font-weight: bold; }
        .disclaimer { border-left: 4px solid #f0ad4e; padding-left: 12px; margin-top: 2rem; font-style: italic; color: var(--vscode-descriptionForeground); }
        .btn { display: inline-block; padding: 8px 16px; margin-top: 10px; background: var(--vscode-button-background); color: var(--vscode-button-foreground); border: none; border-radius: 4px; font-weight: bold; cursor: pointer; text-decoration: none; }
        .btn:hover { background: var(--vscode-button-hoverBackground); }
    </style>
</head>
<body>
    <h1>🛡️ Policy-to-Code Traceability Chain</h1>
    <p>File: <code>${ctx.fileName}:${ctx.lineNumber + 1}</code> | Policy: <strong>${policy.id}</strong></p>

    <div class="trace-container">
        <div class="step-card code-step">
            <strong>1. Source Code Line</strong>
            <div class="code-block">${chain.sourceCodeLine}</div>
        </div>

        <div class="arrow">↓</div>

        <div class="step-card">
            <strong>2. Observed Code Pattern</strong>
            <div>${chain.detectedPattern}</div>
        </div>

        <div class="arrow">↓</div>

        <div class="step-card policy-step">
            <strong>3. Matched Policy Requirement</strong>
            <div><strong>${policy.id}</strong> — ${policy.title}</div>
            <p style="margin: 4px 0 0 0; font-size: 0.9em; color: var(--vscode-descriptionForeground);">${policy.description}</p>
        </div>

        <div class="arrow">↓</div>

        ${regHtml}

        <div class="arrow">↓</div>

        <div class="step-card action-step">
            <strong>4. Suggested Developer Action</strong>
            <div>${chain.suggestedAction}</div>
            <h4 style="margin: 10px 0 4px 0;">Safer Example:</h4>
            <div class="code-block">${chain.saferExample}</div>
        </div>
    </div>

    <div class="disclaimer">
        <strong>Disclaimer:</strong> ${ADVISORY_DISCLAIMER}
    </div>
</body>
</html>`;
    }
}
