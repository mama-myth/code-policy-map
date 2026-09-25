export interface ExtractedLoggingCall {
    loggingFunction: string;
    argumentsText: string;
    startIndex: number;
    endIndex: number;
}

export class LoggingDetector {
    private static readonly LOGGING_PATTERNS = [
        /\b(print)\s*\(([\s\S]*?)\)/g,
        /\b(logging\.(?:debug|info|warning|error|critical))\s*\(([\s\S]*?)\)/g,
        /\b(logger\.(?:debug|info|warning|error|exception|critical))\s*\(([\s\S]*?)\)/g
    ];

    public static detectLoggingCalls(lineText: string): ExtractedLoggingCall[] {
        const results: ExtractedLoggingCall[] = [];

        for (const pattern of this.LOGGING_PATTERNS) {
            pattern.lastIndex = 0; // reset regex state
            let match: RegExpExecArray | null;
            while ((match = pattern.exec(lineText)) !== null) {
                results.push({
                    loggingFunction: match[1],
                    argumentsText: match[2],
                    startIndex: match.index,
                    endIndex: match.index + match[0].length
                });
            }
        }

        return results;
    }
}
