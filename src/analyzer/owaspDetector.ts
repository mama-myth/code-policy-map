import * as vscode from 'vscode';
import { DetectedCodeContext } from './types';
import { PolicyRecord } from '../policies/policyTypes';

export class OwaspDetector {
    public static detectOwaspPatterns(
        document: vscode.TextDocument,
        policies: PolicyRecord[]
    ): DetectedCodeContext[] {
        const results: DetectedCodeContext[] = [];

        if (document.languageId !== 'python' && !document.fileName.endsWith('.py')) {
            return results;
        }

        const policyMap = new Map<string, PolicyRecord>();
        policies.forEach((p) => policyMap.set(p.id, p));

        const lineCount = document.lineCount;

        for (let i = 0; i < lineCount; i++) {
            const line = document.lineAt(i);
            const lineText = line.text;

            if (!lineText.trim() || lineText.trim().startsWith('#')) {
                continue;
            }

            const firstChar = lineText.search(/\S/);
            const startCol = firstChar >= 0 ? firstChar : 0;
            const endCol = lineText.length;

            // 1. SEC-CRY-001: Hardcoded secrets
            if (policyMap.has('SEC-CRY-001')) {
                const secretMatch = /\b(?:api_key|secret_key|secret|access_token|private_key|jwt_secret|app_secret|password)\s*=\s*['"][a-zA-Z0-9_\-\.]{6,}['"]/i.exec(lineText);
                if (secretMatch) {
                    const p = policyMap.get('SEC-CRY-001')!;
                    results.push(this.createContext(document, i, startCol, endCol, lineText, 'assignment', 'hardcoded_secret', 'PAT-SEC-CRY-001', p));
                }
            }

            // 2. SEC-CRY-002: Weak Hash Functions
            if (policyMap.has('SEC-CRY-002')) {
                const hashMatch = /\bhashlib\.(?:md5|sha1)\b/i.exec(lineText);
                if (hashMatch) {
                    const p = policyMap.get('SEC-CRY-002')!;
                    results.push(this.createContext(document, i, startCol, endCol, lineText, hashMatch[0], 'weak_hash_function', 'PAT-SEC-CRY-002', p));
                }
            }

            // 3. SEC-INJ-001: SQL Injection
            if (policyMap.has('SEC-INJ-001')) {
                const sqlMatch = /\b(?:execute|executemany)\s*\(\s*(?:f['"]|['"].*?%[sdr].*?['"]|['"].*?\{\}.*?['"]\.format|.*?\+)/i.exec(lineText);
                if (sqlMatch) {
                    const p = policyMap.get('SEC-INJ-001')!;
                    results.push(this.createContext(document, i, startCol, endCol, lineText, 'execute', 'unsanitized_sql', 'PAT-SEC-INJ-001', p));
                }
            }

            // 4. SEC-INJ-002: Command Injection
            if (policyMap.has('SEC-INJ-002')) {
                const cmdMatch = /\b(?:os\.system\b|subprocess\.(?:call|run|Popen)\b)/i.exec(lineText);
                if (cmdMatch) {
                    const p = policyMap.get('SEC-INJ-002')!;
                    results.push(this.createContext(document, i, startCol, endCol, lineText, 'os.system/subprocess', 'shell_execution', 'PAT-SEC-INJ-002', p));
                }
            }

            // 5. SEC-CFG-001: Debug Mode Enabled
            if (policyMap.has('SEC-CFG-001')) {
                const debugMatch = /\b(?:debug\s*=\s*True|DEBUG\s*=\s*True)\b/i.exec(lineText);
                if (debugMatch) {
                    const p = policyMap.get('SEC-CFG-001')!;
                    results.push(this.createContext(document, i, startCol, endCol, lineText, 'debug_configuration', 'debug_mode_enabled', 'PAT-SEC-CFG-001', p));
                }
            }

            // 6. SEC-DES-001: Insecure Object Deserialization
            if (policyMap.has('SEC-DES-001')) {
                const desMatch = /\b(?:pickle\.(?:loads|load)|yaml\.load)\b/i.exec(lineText);
                if (desMatch) {
                    const p = policyMap.get('SEC-DES-001')!;
                    results.push(this.createContext(document, i, startCol, endCol, lineText, desMatch[0], 'untrusted_deserialization', 'PAT-SEC-DES-001', p));
                }
            }

            // 7. SEC-NET-001: SSRF / Unvalidated Requests
            if (policyMap.has('SEC-NET-001')) {
                const netMatch = /\b(?:requests\.(?:get|post|put|delete|request)|urlopen)\s*\(/i.exec(lineText);
                if (netMatch) {
                    const p = policyMap.get('SEC-NET-001')!;
                    results.push(this.createContext(document, i, startCol, endCol, lineText, 'requests/urlopen', 'unvalidated_url_request', 'PAT-SEC-NET-001', p));
                }
            }

            // 8. SEC-PTH-001: Path Traversal
            if (policyMap.has('SEC-PTH-001')) {
                const pathMatch = /\bopen\s*\(\s*(?:f['"]|.*?\+)/i.exec(lineText);
                if (pathMatch) {
                    const p = policyMap.get('SEC-PTH-001')!;
                    results.push(this.createContext(document, i, startCol, endCol, lineText, 'open', 'path_concatenation', 'PAT-SEC-PTH-001', p));
                }
            }

            // 9. SEC-LOG-003: Silent Exception Handling
            if (policyMap.has('SEC-LOG-003')) {
                if (lineText.trim().startsWith('except')) {
                    const isInlinePass = lineText.includes('pass');
                    const isNextLinePass = i + 1 < lineCount && document.lineAt(i + 1).text.trim() === 'pass';
                    if (isInlinePass || isNextLinePass) {
                        const p = policyMap.get('SEC-LOG-003')!;
                        results.push(this.createContext(document, i, startCol, endCol, lineText, 'except', 'silent_exception_pass', 'PAT-SEC-LOG-003', p));
                    }
                }
            }
        }

        return results;
    }

    private static createContext(
        document: vscode.TextDocument,
        lineIndex: number,
        startCol: number,
        endCol: number,
        lineText: string,
        detectedFunc: string,
        matchedIdentifier: string,
        patternId: string,
        policy: PolicyRecord
    ): DetectedCodeContext {
        const range = new vscode.Range(
            new vscode.Position(lineIndex, startCol),
            new vscode.Position(lineIndex, endCol)
        );

        return {
            fileUri: document.uri,
            fileName: vscode.workspace.asRelativePath(document.uri),
            lineNumber: lineIndex,
            lineText: lineText.trim(),
            detectedLoggingFunction: detectedFunc,
            matchedSensitiveIdentifier: matchedIdentifier,
            patternId,
            matchedPolicyId: policy.id,
            severity: policy.severity,
            range
        };
    }
}
