import * as vscode from 'vscode';
import { DetectedCodeContext } from './types';
import { PolicyRecord } from '../policies/policyTypes';

export class OwaspDetector {
    public static detectOwaspPatterns(
        document: vscode.TextDocument,
        policies: PolicyRecord[]
    ): DetectedCodeContext[] {
        const results: DetectedCodeContext[] = [];

        if (document.languageId !== 'python') {
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

            // 1. SEC-CRY-001: Hardcoded secrets
            if (policyMap.has('SEC-CRY-001')) {
                const secretMatch = /(?:api_key|secret_key|access_token|private_key|jwt_secret|app_secret)\s*=\s*['"][a-zA-Z0-9_\-\.]{8,}['"]/i.exec(lineText);
                if (secretMatch) {
                    const p = policyMap.get('SEC-CRY-001')!;
                    results.push(this.createContext(document, i, secretMatch.index, secretMatch[0].length, lineText, 'assignment', 'hardcoded_secret', 'PAT-SEC-CRY-001', p));
                }
            }

            // 2. SEC-CRY-002: Weak Hash Functions
            if (policyMap.has('SEC-CRY-002')) {
                const hashMatch = /hashlib\.(md5|sha1)\s*\(/i.exec(lineText);
                if (hashMatch) {
                    const p = policyMap.get('SEC-CRY-002')!;
                    results.push(this.createContext(document, i, hashMatch.index, hashMatch[0].length, lineText, `hashlib.${hashMatch[1]}`, hashMatch[1], 'PAT-SEC-CRY-002', p));
                }
            }

            // 3. SEC-INJ-001: SQL Injection
            if (policyMap.has('SEC-INJ-001')) {
                const sqlMatch = /(?:execute|executemany)\s*\(\s*(?:f['"]|['"].*?%s.*?['"]\s*%|['"].*?\{\}.*?['"]\.format)/i.exec(lineText);
                if (sqlMatch) {
                    const p = policyMap.get('SEC-INJ-001')!;
                    results.push(this.createContext(document, i, sqlMatch.index, sqlMatch[0].length, lineText, 'execute', 'unsanitized_sql', 'PAT-SEC-INJ-001', p));
                }
            }

            // 4. SEC-INJ-002: Command Injection
            if (policyMap.has('SEC-INJ-002')) {
                const cmdMatch = /(?:os\.system\s*\(|subprocess\.(?:call|run|Popen)\s*\(.*?,?\s*shell\s*=\s*True)/i.exec(lineText);
                if (cmdMatch) {
                    const p = policyMap.get('SEC-INJ-002')!;
                    results.push(this.createContext(document, i, cmdMatch.index, cmdMatch[0].length, lineText, 'os.system/subprocess', 'shell_execution', 'PAT-SEC-INJ-002', p));
                }
            }

            // 5. SEC-CFG-001: Debug Mode Enabled
            if (policyMap.has('SEC-CFG-001')) {
                const debugMatch = /(?:app\.run\s*\(.*?\bdebug\s*=\s*True\b|DEBUG\s*=\s*True)/i.exec(lineText);
                if (debugMatch) {
                    const p = policyMap.get('SEC-CFG-001')!;
                    results.push(this.createContext(document, i, debugMatch.index, debugMatch[0].length, lineText, 'app.run', 'debug_mode', 'PAT-SEC-CFG-001', p));
                }
            }

            // 6. SEC-DES-001: Insecure Object Deserialization
            if (policyMap.has('SEC-DES-001')) {
                const desMatch = /(?:pickle\.(?:loads|load)\s*\(|yaml\.load\s*\([^,)]*(?:\)|,\s*Loader\s*=\s*yaml\.(?:Loader|UnsafeLoader)))/i.exec(lineText);
                if (desMatch) {
                    const p = policyMap.get('SEC-DES-001')!;
                    results.push(this.createContext(document, i, desMatch.index, desMatch[0].length, lineText, 'pickle/yaml.load', 'untrusted_deserialization', 'PAT-SEC-DES-001', p));
                }
            }

            // 7. SEC-NET-001: SSRF / Unvalidated Requests
            if (policyMap.has('SEC-NET-001')) {
                const netMatch = /(?:requests\.(?:get|post|put|delete)\s*\(\s*[a-zA-Z_][a-zA-Z0-9_]*\s*[,)]|urlopen\s*\(\s*[a-zA-Z_][a-zA-Z0-9_]*\s*[,)])/i.exec(lineText);
                if (netMatch) {
                    const p = policyMap.get('SEC-NET-001')!;
                    results.push(this.createContext(document, i, netMatch.index, netMatch[0].length, lineText, 'requests/urlopen', 'unvalidated_url_request', 'PAT-SEC-NET-001', p));
                }
            }

            // 8. SEC-PTH-001: Path Traversal
            if (policyMap.has('SEC-PTH-001')) {
                const pathMatch = /\bopen\s*\(\s*(?:f['"].*?\{|.*?\+\s*[a-zA-Z_])/i.exec(lineText);
                if (pathMatch) {
                    const p = policyMap.get('SEC-PTH-001')!;
                    results.push(this.createContext(document, i, pathMatch.index, pathMatch[0].length, lineText, 'open', 'path_concatenation', 'PAT-SEC-PTH-001', p));
                }
            }

            // 9. SEC-LOG-003: Silent Exception Handling
            if (policyMap.has('SEC-LOG-003')) {
                if (lineText.trim().startsWith('except') && (lineText.includes('pass') || (i + 1 < lineCount && document.lineAt(i + 1).text.trim() === 'pass'))) {
                    const p = policyMap.get('SEC-LOG-003')!;
                    results.push(this.createContext(document, i, 0, lineText.length, lineText, 'except', 'silent_exception_pass', 'PAT-SEC-LOG-003', p));
                }
            }
        }

        return results;
    }

    private static createContext(
        document: vscode.TextDocument,
        lineIndex: number,
        startIndex: number,
        length: number,
        lineText: string,
        detectedFunc: string,
        matchedIdentifier: string,
        patternId: string,
        policy: PolicyRecord
    ): DetectedCodeContext {
        const range = new vscode.Range(
            new vscode.Position(lineIndex, startIndex),
            new vscode.Position(lineIndex, startIndex + length)
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
