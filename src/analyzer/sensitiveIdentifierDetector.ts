export interface SensitiveIdentifierMatch {
    identifier: string;
    startIndex: number;
    endIndex: number;
}

export class SensitiveIdentifierDetector {
    public static matchIdentifiers(
        argumentsText: string,
        configuredIdentifiers: string[]
    ): SensitiveIdentifierMatch[] {
        const matches: SensitiveIdentifierMatch[] = [];

        for (const identifier of configuredIdentifiers) {
            const escaped = identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(?<![a-zA-Z0-9_])${escaped}(?![a-zA-Z0-9_])`, 'i');
            const match = regex.exec(argumentsText);
            if (match) {
                matches.push({
                    identifier,
                    startIndex: match.index,
                    endIndex: match.index + match[0].length
                });
            }
        }

        return matches;
    }
}
