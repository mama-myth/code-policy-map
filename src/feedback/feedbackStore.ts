import * as vscode from 'vscode';

export type FeedbackAction = 'helpful' | 'not_helpful' | 'dismiss' | 'view_policy' | 'show_safer_example';

export interface FeedbackEntry {
    timestamp: string;
    policyId: string;
    patternId: string;
    action: FeedbackAction;
}

export class FeedbackStore {
    private static readonly STORAGE_KEY = 'policyToCode.feedbackEntries';
    private static readonly DISMISSED_PATTERNS_KEY = 'policyToCode.dismissedPatterns';

    constructor(private readonly Memento: vscode.Memento) {}

    public async recordFeedback(
        policyId: string,
        patternId: string,
        action: FeedbackAction
    ): Promise<void> {
        const entries = this.getFeedbackEntries();
        const newEntry: FeedbackEntry = {
            timestamp: new Date().toISOString(),
            policyId,
            patternId,
            action
        };
        entries.push(newEntry);
        await this.Memento.update(FeedbackStore.STORAGE_KEY, entries);

        if (action === 'dismiss') {
            const dismissed = this.getDismissedPatterns();
            if (!dismissed.includes(patternId)) {
                dismissed.push(patternId);
                await this.Memento.update(FeedbackStore.DISMISSED_PATTERNS_KEY, dismissed);
            }
        }
    }

    public getFeedbackEntries(): FeedbackEntry[] {
        return this.Memento.get<FeedbackEntry[]>(FeedbackStore.STORAGE_KEY, []);
    }

    public getDismissedPatterns(): string[] {
        return this.Memento.get<string[]>(FeedbackStore.DISMISSED_PATTERNS_KEY, []);
    }

    public isPatternDismissed(patternId: string): boolean {
        return this.getDismissedPatterns().includes(patternId);
    }

    public async clearFeedback(): Promise<void> {
        await this.Memento.update(FeedbackStore.STORAGE_KEY, []);
        await this.Memento.update(FeedbackStore.DISMISSED_PATTERNS_KEY, []);
    }

    public getSummary(): {
        totalFeedback: number;
        helpfulCount: number;
        notHelpfulCount: number;
        dismissCount: number;
        viewPolicyCount: number;
        showSaferExampleCount: number;
    } {
        const entries = this.getFeedbackEntries();
        return {
            totalFeedback: entries.length,
            helpfulCount: entries.filter((e) => e.action === 'helpful').length,
            notHelpfulCount: entries.filter((e) => e.action === 'not_helpful').length,
            dismissCount: entries.filter((e) => e.action === 'dismiss').length,
            viewPolicyCount: entries.filter((e) => e.action === 'view_policy').length,
            showSaferExampleCount: entries.filter((e) => e.action === 'show_safer_example').length
        };
    }
}
