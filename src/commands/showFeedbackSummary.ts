import * as vscode from 'vscode';
import { FeedbackStore } from '../feedback/feedbackStore';

export function registerShowFeedbackSummaryCommand(feedbackStore: FeedbackStore): vscode.Disposable {
    return vscode.commands.registerCommand('policyToCode.showFeedbackSummary', async () => {
        const summary = feedbackStore.getSummary();

        const msg = `[Policy-to-Code Feedback Summary]
• Total Recorded Actions: ${summary.totalFeedback}
• Helpful Ratings: ${summary.helpfulCount}
• Not Helpful Ratings: ${summary.notHelpfulCount}
• Dismissed Findings: ${summary.dismissCount}
• Policy Views: ${summary.viewPolicyCount}
• Safer Examples Viewed: ${summary.showSaferExampleCount}

Note: All feedback is stored strictly locally on your machine.`;

        const choice = await vscode.window.showInformationMessage(
            msg,
            { modal: true },
            'Clear Feedback History'
        );

        if (choice === 'Clear Feedback History') {
            await feedbackStore.clearFeedback();
            vscode.window.showInformationMessage('Policy-to-Code: Local feedback history cleared.');
        }
    });
}
