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

        if (document.languageId !== 'python') {
            return results;
        }

        // 1. Detect Logging & Personal Data Logging Patterns
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

        // 2. Detect OWASP Top 10 Security Policy Patterns
        const owaspResults = OwaspDetector.detectOwaspPatterns(document, policies);
        results.push(...owaspResults);

        return results;
    }
}
