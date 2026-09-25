import * as assert from 'assert';
import * as vscode from 'vscode';
import { PolicyTreeDataProvider } from '../../views/policyTreeDataProvider';
import { PolicyLoader } from '../../policies/policyLoader';
import { TraceabilityBuilder } from '../../guidance/traceabilityBuilder';
import { DetectedCodeContext } from '../../analyzer/types';
import { PolicyRecord } from '../../policies/policyTypes';

suite('Tree Data Provider & Traceability Test Suite', () => {
    test('Constructs policy tree items cleanly', async () => {
        const loader = new PolicyLoader();
        const provider = new PolicyTreeDataProvider(loader);

        const dummyContext: DetectedCodeContext = {
            fileUri: vscode.Uri.file('/test/app.py'),
            fileName: 'app.py',
            lineNumber: 2,
            lineText: 'print(password)',
            detectedLoggingFunction: 'print',
            matchedSensitiveIdentifier: 'password',
            patternId: 'PAT-SEC-LOG-001-password',
            matchedPolicyId: 'SEC-LOG-001',
            severity: 'high',
            range: new vscode.Range(new vscode.Position(2, 0), new vscode.Position(2, 15))
        };

        provider.updateFindings([dummyContext]);
        const children = await provider.getChildren();

        assert.strictEqual(children.length, 1);
        assert.ok(children[0].label?.toString().includes('SEC-LOG-001'));
        assert.strictEqual(children[0].description, 'app.py:3');
    });

    test('Renders traceability HTML with disclaimer', () => {
        const dummyContext: DetectedCodeContext = {
            fileUri: vscode.Uri.file('/test/app.py'),
            fileName: 'app.py',
            lineNumber: 2,
            lineText: 'logger.info(email)',
            detectedLoggingFunction: 'logger.info',
            matchedSensitiveIdentifier: 'email',
            patternId: 'PAT-SEC-LOG-002-email',
            matchedPolicyId: 'SEC-LOG-002',
            severity: 'medium',
            range: new vscode.Range(new vscode.Position(2, 0), new vscode.Position(2, 18))
        };

        const dummyPolicy: PolicyRecord = {
            id: 'SEC-LOG-002',
            title: 'Personal Data in Logs Must Be Minimized',
            category: 'Privacy-Aware Logging',
            description: 'Personal data should not be written to logs.',
            riskExplanation: 'Logs may be retained or shared.',
            sensitiveIdentifiers: ['email'],
            loggingFunctions: ['logger.info'],
            suggestedAction: 'Use masked user ID.',
            saferExample: 'logger.info("user_id=%s", user_id)',
            supportingRegulatoryContext: [
                {
                    framework: 'GDPR',
                    article: 'Article 5(1)(c)',
                    title: 'Data minimisation',
                    relationship: 'Supporting privacy context.'
                }
            ],
            severity: 'medium'
        };

        const html = TraceabilityBuilder.renderTraceabilityHtml(dummyContext, dummyPolicy);

        assert.ok(html.includes('Policy-to-Code Traceability Chain'));
        assert.ok(html.includes('SEC-LOG-002'));
        assert.ok(html.includes('logger.info(email)'));
        assert.ok(html.includes('GDPR Article 5(1)(c)'));
        assert.ok(html.includes('Disclaimer:'));
    });
});
