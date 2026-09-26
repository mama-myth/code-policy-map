import * as assert from 'assert';
import * as path from 'path';
import { PolicyLoader } from '../../policies/policyLoader';

suite('Policy Loader Test Suite', () => {
    test('Loads curated policy records successfully', async () => {
        const loader = new PolicyLoader();
        const policiesPath = path.resolve(__dirname, '../../../resources/policies.json');
        const policies = await loader.loadPolicies(policiesPath);

        assert.ok(policies.length >= 11);

        const secLog001 = loader.getPolicyById('SEC-LOG-001');
        assert.ok(secLog001);
        assert.strictEqual(secLog001?.title, 'Sensitive Data Must Not Be Logged');
        assert.ok(secLog001?.sensitiveIdentifiers.includes('password'));

        const secLog002 = loader.getPolicyById('SEC-LOG-002');
        assert.ok(secLog002);
        assert.strictEqual(secLog002?.title, 'Personal Data in Logs Must Be Minimized');
        assert.ok(secLog002?.sensitiveIdentifiers.includes('email'));

        const secInj001 = loader.getPolicyById('SEC-INJ-001');
        assert.ok(secInj001);
        assert.strictEqual(secInj001?.title, 'SQL Queries Must Use Parameterized Input');
    });

    test('Handles non-existent policy file gracefully', async () => {
        const loader = new PolicyLoader();
        const policies = await loader.loadPolicies('/invalid/path/policies.json');
        assert.strictEqual(policies.length, 0);
    });
});
