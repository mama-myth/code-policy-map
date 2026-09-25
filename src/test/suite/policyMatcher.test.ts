import * as assert from 'assert';
import * as path from 'path';
import { PolicyLoader } from '../../policies/policyLoader';
import { PolicyMatcher } from '../../policies/policyMatcher';

suite('Policy Matcher Test Suite', () => {
    test('Matches SEC-LOG-001 for credential logging', async () => {
        const loader = new PolicyLoader();
        const policiesPath = path.resolve(__dirname, '../../../resources/policies.json');
        const policies = await loader.loadPolicies(policiesPath);

        const findings = PolicyMatcher.matchPolicies('logger.info', 'password', policies);
        assert.strictEqual(findings.length, 1);
        assert.strictEqual(findings[0].policy.id, 'SEC-LOG-001');
        assert.strictEqual(findings[0].matchedIdentifier, 'password');
    });

    test('Matches SEC-LOG-002 for personal data logging', async () => {
        const loader = new PolicyLoader();
        const policiesPath = path.resolve(__dirname, '../../../resources/policies.json');
        const policies = await loader.loadPolicies(policiesPath);

        const findings = PolicyMatcher.matchPolicies('logger.info', 'user.email', policies);
        assert.strictEqual(findings.length, 1);
        assert.strictEqual(findings[0].policy.id, 'SEC-LOG-002');
        assert.strictEqual(findings[0].matchedIdentifier, 'email');
    });

    test('Does not match safe logging statement', async () => {
        const loader = new PolicyLoader();
        const policiesPath = path.resolve(__dirname, '../../../resources/policies.json');
        const policies = await loader.loadPolicies(policiesPath);

        const findings = PolicyMatcher.matchPolicies('logger.info', '"Application started"', policies);
        assert.strictEqual(findings.length, 0);
    });
});
