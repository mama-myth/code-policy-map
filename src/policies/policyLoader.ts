import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { PolicyRecord } from './policyTypes';

export class PolicyLoader {
    private policies: PolicyRecord[] = [];
    private loaded = false;

    constructor(private readonly extensionUri?: vscode.Uri) {}

    public async loadPolicies(customPath?: string): Promise<PolicyRecord[]> {
        try {
            let jsonPath: string;
            if (customPath) {
                jsonPath = customPath;
            } else if (this.extensionUri) {
                jsonPath = path.join(this.extensionUri.fsPath, 'resources', 'policies.json');
            } else {
                jsonPath = path.join(__dirname, '..', '..', 'resources', 'policies.json');
            }

            if (!fs.existsSync(jsonPath)) {
                console.error(`Policy file not found at path: ${jsonPath}`);
                return [];
            }

            const rawData = await fs.promises.readFile(jsonPath, 'utf8');
            const parsed = JSON.parse(rawData);

            if (!Array.isArray(parsed)) {
                console.error('Malformed policy data: Root is not an array.');
                return [];
            }

            const validatedPolicies: PolicyRecord[] = [];

            for (const item of parsed) {
                if (this.isValidPolicyRecord(item)) {
                    validatedPolicies.push(item as PolicyRecord);
                } else {
                    console.warn('Skipping invalid policy record:', item);
                }
            }

            this.policies = validatedPolicies;
            this.loaded = true;
            return this.policies;
        } catch (error) {
            console.error('Error loading policies:', error);
            return [];
        }
    }

    public getPolicies(): PolicyRecord[] {
        return this.policies;
    }

    public getPolicyById(id: string): PolicyRecord | undefined {
        return this.policies.find((p) => p.id === id);
    }

    private isValidPolicyRecord(record: any): boolean {
        return (
            typeof record === 'object' &&
            record !== null &&
            typeof record.id === 'string' &&
            typeof record.title === 'string' &&
            typeof record.category === 'string' &&
            typeof record.description === 'string' &&
            typeof record.riskExplanation === 'string' &&
            Array.isArray(record.sensitiveIdentifiers) &&
            Array.isArray(record.loggingFunctions) &&
            typeof record.suggestedAction === 'string' &&
            typeof record.saferExample === 'string' &&
            Array.isArray(record.supportingRegulatoryContext) &&
            typeof record.severity === 'string'
        );
    }
}
