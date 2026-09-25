export type PolicySeverity = 'low' | 'medium' | 'high' | 'critical';

export interface RegulatoryContext {
    framework: string;
    article: string;
    title: string;
    relationship: string;
}

export interface PolicyRecord {
    id: string;
    title: string;
    category: string;
    description: string;
    riskExplanation: string;
    sensitiveIdentifiers: string[];
    loggingFunctions: string[];
    suggestedAction: string;
    saferExample: string;
    supportingRegulatoryContext: RegulatoryContext[];
    severity: PolicySeverity;
}

export const ADVISORY_DISCLAIMER = "This is automated developer guidance, not legal advice or a legal-compliance determination.";
