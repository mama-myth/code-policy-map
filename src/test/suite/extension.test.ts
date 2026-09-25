import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Commands are registered', async () => {
        const ext = vscode.extensions.getExtension('policy-to-code.policy-to-code-mapper');
        if (ext && !ext.isActive) {
            await ext.activate();
        }

        const commands = await vscode.commands.getCommands(true);
        assert.ok(commands.includes('policyToCode.analyzeCurrentFile'));
        assert.ok(commands.includes('policyToCode.showPolicyGuidance'));
        assert.ok(commands.includes('policyToCode.showTraceability'));
    });
});
