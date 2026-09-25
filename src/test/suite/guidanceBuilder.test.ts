import * as assert from 'assert';
import * as vscode from 'vscode';
import { GuidanceBuilder } from '../../guidance/guidanceBuilder';
import { DetectedCodeContext } from '../../analyzer/types';
import { PolicyRecord } from '../../policies/policyTypes';

suite('Guidance Builder Test Suite', () => {
    test('Builds rich Markdown hover content with policy details and disclaimer', () => {
        const dummyContext: DetectedCodeContext = {
            fileUri: vscode.Uri.file('/test/app.py'),
            fileName: 'app.py',
            lineNumber: 5,
            lineText: 'logger.info("Login password: %s", password)',
            detectedLoggingFunction: 'logger.info',
            matchedSensitiveIdentifier: 'password',
            patternId: 'PAT-SEC-LOG-001-password',
            matchedPolicyId: 'SEC-LOG-001',
            severity: 'high',
            range: new vscode.Range(new vscode.Position(5, 0), new vscode.Position(5, 42))
        };

        const dummyPolicy: PolicyRecord = {
            id: 'SEC-LOG-001',
            title: 'Sensitive Data Must Not Be Logged',
            category: 'Secure Logging',
            description: 'Passwords must not be written to logs.',
            riskExplanation: 'Credentials in logs can be exposed.',
            sensitiveIdentifiers: ['password'],
            loggingFunctions: ['logger.info'],
            suggestedAction: 'Remove password from log statement.',
            saferExample: 'logger.info("User logged in")',
            supportingRegulatoryContext: [
                {
                    framework: 'GDPR',
                    article: 'Article 32',
                    title: 'Security of processing',
                    relationship: 'Supporting security context only.'
                }
            ],
            severity: 'high'
        };

        const markdown = GuidanceBuilder.buildHoverMarkdown(dummyContext, dummyPolicy);
        const value = markdown.value;

        assert.ok(value.includes('Policy-to-Code Guidance'));
        assert.ok(value.includes('SEC-LOG-001'));
        assert.ok(value.includes('Sensitive Data Must Not Be Logged'));
        assert.ok(value.includes('logger.info("Login password: %s", password)'));
        assert.ok(value.includes('GDPR Article 32'));
        assert.ok(value.includes('Disclaimer: This is automated developer guidance, not legal advice or a legal-compliance determination.'));
    });
});
