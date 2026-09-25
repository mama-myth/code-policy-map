import * as vscode from 'vscode';
import { PolicyLoader } from '../policies/policyLoader';
import { ADVISORY_DISCLAIMER } from '../policies/policyTypes';

export function registerShowPolicyGuidanceCommand(policyLoader: PolicyLoader): vscode.Disposable {
    return vscode.commands.registerCommand('policyToCode.showPolicyGuidance', async () => {
        const policies = policyLoader.getPolicies().length > 0
            ? policyLoader.getPolicies()
            : await policyLoader.loadPolicies();

        if (policies.length === 0) {
            vscode.window.showErrorMessage('No policy records available.');
            return;
        }

        const items = policies.map((policy) => ({
            label: `${policy.id}: ${policy.title}`,
            description: `[${policy.category}] Severity: ${policy.severity.toUpperCase()}`,
            detail: policy.description,
            policy: policy
        }));

        const selected = await vscode.window.showQuickPick(items, {
            placeHolder: 'Select an organizational policy to view guidance'
        });

        if (!selected) {
            return;
        }

        const p = selected.policy;
        const panel = vscode.window.createWebviewPanel(
            'policyGuidanceDetail',
            `Policy Guidance: ${p.id}`,
            vscode.ViewColumn.Beside,
            { enableScripts: true }
        );

        const regContextHtml = p.supportingRegulatoryContext.map((reg) => `
            <div class="card">
                <strong>Framework:</strong> ${reg.framework} ${reg.article} — ${reg.title}<br/>
                <em>${reg.relationship}</em>
            </div>
        `).join('');

        panel.webview.html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${p.id} — ${p.title}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 1rem; line-height: 1.5; color: var(--vscode-editor-foreground); background-color: var(--vscode-editor-background); }
        h1, h2, h3 { color: var(--vscode-symbolIcon-keywordForeground, #007acc); }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 0.85em; text-transform: uppercase; background: var(--vscode-badge-background); color: var(--vscode-badge-foreground); }
        .badge-high { background-color: #d9534f; color: #fff; }
        .badge-medium { background-color: #f0ad4e; color: #fff; }
        .code-block { background: var(--vscode-textCodeBlock-background, #1e1e1e); padding: 8px 12px; border-radius: 4px; font-family: monospace; white-space: pre-wrap; }
        .card { border: 1px solid var(--vscode-widget-border, #444); padding: 10px; border-radius: 4px; margin-bottom: 10px; }
        .disclaimer { border-left: 4px solid #f0ad4e; padding-left: 10px; margin-top: 20px; font-style: italic; color: var(--vscode-descriptionForeground); }
    </style>
</head>
<body>
    <h1>${p.id} — ${p.title}</h1>
    <p><span class="badge badge-${p.severity}">${p.severity}</span> <strong>Category:</strong> ${p.category}</p>

    <h2>Description</h2>
    <p>${p.description}</p>

    <h2>Why This Matters</h2>
    <p>${p.riskExplanation}</p>

    <h2>Suggested Developer Action</h2>
    <p>${p.suggestedAction}</p>

    <h2>Safer Implementation Example</h2>
    <div class="code-block">${p.saferExample}</div>

    <h2>Supporting Regulatory Context</h2>
    ${regContextHtml}

    <div class="disclaimer">
        <strong>Disclaimer:</strong> ${ADVISORY_DISCLAIMER}
    </div>
</body>
</html>`;
    });
}
