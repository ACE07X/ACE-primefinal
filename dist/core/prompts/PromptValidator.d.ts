export declare class PromptValidator {
    private static readonly FORBIDDEN_PATTERNS;
    static validate(promptText: unknown, promptName: string): void;
    static validateMinLength(promptText: string, promptName: string, minLength: number): void;
    static validateMaxLength(promptText: string, promptName: string, maxLength: number): void;
}
//# sourceMappingURL=PromptValidator.d.ts.map