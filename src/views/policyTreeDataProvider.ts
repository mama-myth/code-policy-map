import * as vscode from 'vscode';
import { DetectedCodeContext } from '../analyzer/types';
import { PolicyLoader } from '../policies/policyLoader';

export class PolicyTreeItem extends vscode.TreeItem {
    constructor(
        public readonly contextItem: DetectedCodeContext,
        public readonly policyTitle: string
    ) {
        super(
            `${contextItem.matchedPolicyId}: ${policyTitle}`,
            vscode.TreeItemCollapsibleState.None
        );

        this.description = `${contextItem.fileName}:${contextItem.lineNumber + 1}`;
        this.tooltip = `${contextItem.matchedPolicyId} (${contextItem.severity.toUpperCase()}) - ${contextItem.lineText}`;

        this.iconPath = new vscode.ThemeIcon(
            contextItem.severity === 'high' || contextItem.severity === 'critical'
                ? 'warning'
                : 'info'
        );

        this.command = {
            command: 'policyToCode.showTraceability',
            title: 'View Traceability',
            arguments: [contextItem]
        };
    }
}

export class PolicyTreeDataProvider implements vscode.TreeDataProvider<PolicyTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<PolicyTreeItem | undefined | void> =
        new vscode.EventEmitter<PolicyTreeItem | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<PolicyTreeItem | undefined | void> =
        this._onDidChangeTreeData.event;

    private currentFindings: DetectedCodeContext[] = [];

    constructor(private readonly policyLoader: PolicyLoader) {}

    public updateFindings(findings: DetectedCodeContext[]): void {
        this.currentFindings = findings;
        this._onDidChangeTreeData.fire();
    }

    public getTreeItem(element: PolicyTreeItem): vscode.TreeItem {
        return element;
    }

    public getChildren(element?: PolicyTreeItem): Thenable<PolicyTreeItem[]> {
        if (element) {
            return Promise.resolve([]);
        }

        const items = this.currentFindings.map((ctx) => {
            const policy = this.policyLoader.getPolicyById(ctx.matchedPolicyId);
            const title = policy ? policy.title : ctx.matchedPolicyId;
            return new PolicyTreeItem(ctx, title);
        });

        return Promise.resolve(items);
    }
}
