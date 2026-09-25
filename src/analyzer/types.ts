import * as vscode from 'vscode';
import { PolicySeverity } from '../policies/policyTypes';

export interface DetectedCodeContext {
    fileUri: vscode.Uri;
    fileName: string;
    lineNumber: number; // 0-indexed line number for VS Code APIs
    lineText: string;
    detectedLoggingFunction: string;
    matchedSensitiveIdentifier: string;
    patternId: string;
    matchedPolicyId: string;
    severity: PolicySeverity;
    range: vscode.Range;
}
