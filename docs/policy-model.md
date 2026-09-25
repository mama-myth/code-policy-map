# Local Policy Knowledge Base Data Model & Schema Specification

## 1. Data Model Overview

The policy knowledge base (`resources/policies.json`) is stored locally as a JSON array of curated policy objects. Every policy record defines organizational requirements, risk explanations, logging function patterns, sensitive identifier targets, recommended remediation actions, safe implementation examples, and supporting regulatory references.

---

## 2. TypeScript Data Schema (`PolicyRecord`)

```typescript
export type PolicySeverity = 'low' | 'medium' | 'high' | 'critical';

export interface RegulatoryContext {
    framework: string;     // e.g., "GDPR", "ISO/IEC 27001", "PCI-DSS"
    article: string;       // e.g., "Article 32", "Article 5(1)(c)"
    title: string;         // e.g., "Security of processing"
    relationship: string;  // Supporting context statement (non-legalistic)
}

export interface PolicyRecord {
    id: string;                                  // e.g., "SEC-LOG-001"
    title: string;                               // Short policy title
    category: string;                            // e.g., "Secure Logging"
    description: string;                         // Full policy description
    riskExplanation: string;                     // Operational security risk explanation
    sensitiveIdentifiers: string[];              // Target variables (e.g., ["password", "token", "secret"])
    loggingFunctions: string[];                  // Monitored functions (e.g., ["print", "logger.info"])
    suggestedAction: string;                     // Recommended developer remediation
    saferExample: string;                        // Safe Python code pattern
    supportingRegulatoryContext: RegulatoryContext[]; // Supporting citations
    severity: PolicySeverity;                    // "low" | "medium" | "high" | "critical"
}
```

---

## 3. Curated Initial Policies

### Policy `SEC-LOG-001` — Sensitive Data Must Not Be Logged
* **Category:** Secure Logging
* **Severity:** `high`
* **Monitored Logging Functions:** `print`, `logging.debug`, `logging.info`, `logging.warning`, `logging.error`, `logger.debug`, `logger.info`, `logger.warning`, `logger.error`, `logger.exception`
* **Target Identifiers:** `password`, `passwd`, `pwd`, `token`, `access_token`, `refresh_token`, `api_key`, `apiKey`, `secret`, `credential`, `credentials`
* **Supporting Regulatory Reference:** GDPR Article 32 — Security of processing

### Policy `SEC-LOG-002` — Personal Data in Logs Must Be Minimized
* **Category:** Privacy-Aware Logging
* **Severity:** `medium`
* **Monitored Logging Functions:** `print`, `logging.debug`, `logging.info`, `logging.warning`, `logger.debug`, `logger.info`, `logger.warning`
* **Target Identifiers:** `email`, `phone`, `date_of_birth`, `dateOfBirth`, `address`, `full_name`, `fullName`
* **Supporting Regulatory Reference:** GDPR Article 5(1)(c) — Data minimisation

---

## 4. Regulatory Framing Principles

All regulatory relationships are explicitly tagged as **supporting context only**:
```json
{
  "framework": "GDPR",
  "article": "Article 32",
  "title": "Security of processing",
  "relationship": "Supporting security context only. This is not a legal-compliance conclusion."
}
```
This ensures the developer understands the broader regulatory rationale without mistaking technical guidance for formal legal advice or compliance certification.
