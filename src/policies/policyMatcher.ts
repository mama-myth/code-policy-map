import { PolicyRecord } from './policyTypes';
import { SensitiveIdentifierDetector } from '../analyzer/sensitiveIdentifierDetector';

export interface MatchedPolicyFinding {
    policy: PolicyRecord;
    matchedIdentifier: string;
    matchedLoggingFunction: string;
    patternId: string;
}

export class PolicyMatcher {
    public static matchPolicies(
        loggingFunction: string,
        argumentsText: string,
        policies: PolicyRecord[]
    ): MatchedPolicyFinding[] {
        const findings: MatchedPolicyFinding[] = [];

        for (const policy of policies) {
            const appliesToFunction = policy.loggingFunctions.some((fn) =>
                loggingFunction === fn || loggingFunction.startsWith(fn)
            );

            if (!appliesToFunction) {
                continue;
            }

            const matchedIdentifiers = SensitiveIdentifierDetector.matchIdentifiers(
                argumentsText,
                policy.sensitiveIdentifiers
            );

            if (matchedIdentifiers.length > 0) {
                for (const match of matchedIdentifiers) {
                    findings.push({
                        policy,
                        matchedIdentifier: match.identifier,
                        matchedLoggingFunction: loggingFunction,
                        patternId: `PAT-${policy.id}-${match.identifier}`
                    });
                }
            }
        }

        return findings;
    }
}
