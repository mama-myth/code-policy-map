import * as vscode from 'vscode';
import { DetectedCodeContext } from './types';
import { LoggingDetector } from './loggingDetector';
import { OwaspDetector } from './owaspDetector';
import { PolicyMatcher } from '../policies/policyMatcher';
import { PolicyRecord } from '../policies/policyTypes';

export class CodeContextDetector {
    public static analyzeDocument(
        document: vscode.TextDocument,
        policies: PolicyRecord[]
    ): DetectedCodeContext[] {
        const results: DetectedCodeContext[] = [];

        // Support python languageId and files ending in .py
        if (document.languageId !== 'python' && !document.fileName.endsWith('.py')) {
            return results;
        }

        const lineCount = document.lineCount;

        for (let i = 0; i < lineCount; i++) {
            const line = document.lineAt(i);
            const lineText = line.text;

            if (!lineText.trim() || lineText.trim().startsWith('#')) {
                continue;
            }

            const loggingCalls = LoggingDetector.detectLoggingCalls(lineText);

            for (const call of loggingCalls) {
                const matchedFindings = PolicyMatcher.matchPolicies(
                    call.loggingFunction,
                    call.argumentsText,
                    policies
                );

                for (const finding of matchedFindings) {
                    const range = new vscode.Range(
                        new vscode.Position(i, call.startIndex),
                        new vscode.Position(i, call.endIndex)
                    );

                    results.push({
                        fileUri: document.uri,
                        fileName: vscode.workspace.asRelativePath(document.uri),
                        lineNumber: i,
                        lineText: lineText.trim(),
                        detectedLoggingFunction: finding.matchedLoggingFunction,
                        matchedSensitiveIdentifier: finding.matchedIdentifier,
                        patternId: finding.patternId,
                        matchedPolicyId: finding.policy.id,
                        severity: finding.policy.severity,
                        range
                    });
                }
            }
        }

        const owaspResults = OwaspDetector.detectOwaspPatterns(document, policies);
        results.push(...owaspResults);

        return results;
    }
}
