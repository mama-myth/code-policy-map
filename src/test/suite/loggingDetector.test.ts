import * as assert from 'assert';
import { LoggingDetector } from '../../analyzer/loggingDetector';
import { SensitiveIdentifierDetector } from '../../analyzer/sensitiveIdentifierDetector';

suite('Logging Detector Test Suite', () => {
    test('Detects print function calls', () => {
        const calls = LoggingDetector.detectLoggingCalls('print("Password:", password)');
        assert.strictEqual(calls.length, 1);
        assert.strictEqual(calls[0].loggingFunction, 'print');
        assert.strictEqual(calls[0].argumentsText, '"Password:", password');
    });

    test('Detects logger.info calls', () => {
        const calls = LoggingDetector.detectLoggingCalls('logger.info("Login password: %s", password)');
        assert.strictEqual(calls.length, 1);
        assert.strictEqual(calls[0].loggingFunction, 'logger.info');
    });

    test('Detects sensitive identifier in logging call', () => {
        const calls = LoggingDetector.detectLoggingCalls('logger.warning(token)');
        assert.strictEqual(calls.length, 1);
        const matches = SensitiveIdentifierDetector.matchIdentifiers(calls[0].argumentsText, ['token', 'password']);
        assert.strictEqual(matches.length, 1);
        assert.strictEqual(matches[0].identifier, 'token');
    });

    test('Does not match sensitive variable assignment without logging', () => {
        const calls = LoggingDetector.detectLoggingCalls('password = hash_password(raw_password)');
        assert.strictEqual(calls.length, 0);
    });
});
