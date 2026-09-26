import * as assert from 'assert';
import * as vscode from 'vscode';
import { OwaspDetector } from '../../analyzer/owaspDetector';
import { PolicyLoader } from '../../policies/policyLoader';

suite('OWASP Detector Test Suite', () => {
    test('Detects OWASP security policy violations', async () => {
        const loader = new PolicyLoader();
        const policies = await loader.loadPolicies();

        const dummyDoc = {
            languageId: 'python',
            lineCount: 5,
            uri: vscode.Uri.file('/test/app.py'),
            lineAt: (i: number) => {
                const lines = [
                    'api_key = "sk_live_1234567890abcdef12345"',
                    'hashlib.md5(data.encode())',
                    'cursor.execute(f"SELECT * FROM users WHERE id = \'{user_id}\'")',
                    'os.system("ping " + host)',
                    'pickle.loads(payload)'
                ];
                return { text: lines[i] };
            }
        } as unknown as vscode.TextDocument;

        const results = OwaspDetector.detectOwaspPatterns(dummyDoc, policies);

        assert.strictEqual(results.length, 5);

        const policyIds = results.map((r) => r.matchedPolicyId);
        assert.ok(policyIds.includes('SEC-CRY-001'));
        assert.ok(policyIds.includes('SEC-CRY-002'));
        assert.ok(policyIds.includes('SEC-INJ-001'));
        assert.ok(policyIds.includes('SEC-INJ-002'));
        assert.ok(policyIds.includes('SEC-DES-001'));
    });
});
